//Update the timer on page load & set it to tick every second.
updateTimer()
setInterval('updateTimer()', 1000)

//Pulls previous volume value from local storage if it exists or sets it to 50% if it doesn't.
document.querySelector('audio').volume = localStorage.getItem('volume') ? localStorage.getItem('volume') : 0.5
document.querySelector('#volume').value = localStorage.getItem('volume') ? localStorage.getItem('volume') * 100 : 50

function updateTimer() {
    //Calculates the number of seconds that have passed in the day,
    //divided into 10 equal blocks of time for the timer to use for cycles.
    const time = ((Date.parse(new Date)/1000)%86400000)%8640
    const timer = document.getElementById('timer')



    //Timer cycles are structured as follows:
    //25 minute work period (1500 seconds)
    //1 minute 45 second flex period (105 seconds)
    //5 minute break period (300 seconds)
    //1 minute 45 second flex period
    //
    //Every fourth break period is 15 minutes (900 seconds) instead of 5 minutes.
    //
    //A full block of 3 cycles with short breaks plus one with a long break
    //adds up to 8640 seconds, thus the 10 blocks per day.
    
    let timerState = parseTimerState(time)
    const period = document.getElementById('period')
    const percent = document.getElementById('percent')

    timer.innerText = `${timerState.readableTime[0]}:${timerState.readableTime[1]}`

    if (timerState.currentPeriod == 'flex1') {
        period.innerText = 'Get ready for a break...'
        document.title = 'Get ready for a break...'
    } else if (timerState.currentPeriod == 'flex2') {
        period.innerText = 'Get ready to work...'
        document.title = 'Get ready to work...'
    } else if (timerState.currentPeriod == 'work') {
        period.innerText = 'It\'s time to work.'
        document.title = `Work - ${timerState.readableTime[0]}:${timerState.readableTime[1]}`
    } else if (timerState.currentPeriod == 'short break') {
        period.innerText = 'It\'s time for a short break.'
        document.title = `Break - ${timerState.readableTime[0]}:${timerState.readableTime[1]}`
    } else if (timerState.currentPeriod == 'long break') {
        period.innerText = 'It\'s time for a long break.'
        document.title = `Break - ${timerState.readableTime[0]}:${timerState.readableTime[1]}`
    }

    //Background changing
    percent.value = `${timerState.currentPercent}`
    let color1
    let color2
    if (timerState.currentPeriod === 'work') {
       color1 = '#015d72'
       color2 = '#250071'
    } else if (timerState.currentPeriod === 'long break' || timerState.currentPeriod == 'short break') {
       color1 = '#5d4166'
       color2 = '#250071'
    } else if (timerState.currentPeriod === 'flex1') {
       color1 = '#250071'
       color2 = '#015d72'
    } else if (timerState.currentPeriod === 'flex2') {
       color1 = '#250071'
       color2 = '#5d4166'
    }
    let bg = `conic-gradient(${color1} ${360 * (timerState.currentPercent/100)}deg, ${color2})`
    document.querySelector('body').style.backgroundImage = bg 
}

function parseTimerState(time) {
    let timerState
    
    //Divides the current 8640 second block into four periods:
    //three with short breaks and the last with a long break
    //Sends the approprate time to checkTimerPeriod() to return
    //and object with the state the timer shoud be in.
    switch(true) {
        case time < 2010 :
            timerState = checkTimerPeriod(time) 
            break
        case time < 4020 :
            timerState = checkTimerPeriod(time-2010) 
            break
        case time < 6030 :
            timerState = checkTimerPeriod(time-4020) 
            break
        case time < 8640 :
            timerState = checkTimerPeriod(time-6030, true)
            break
        default:
            timerState = time
            break
    }
    
    return timerState
}

//Checks what period the time passed to it is in based on the
//break points and returns the number of seconds into that period
//plus the current period type and the percent it is complete.
function checkTimerPeriod(time, longBreak = false) {
    let maxPeriodTime

    switch(true) {
        case time < 1500:
            period = 'work'
            maxPeriodTime = 1500
            break
        case time < 1605:
            time = time - 1500
            maxPeriodTime = 105
            period = 'flex1'
            break
        case time < 1905 && longBreak === false:
            time = time - 1605
            maxPeriodTime = 300
            period = 'short break'
            break
        case time < 2505 && longBreak === true:
            time = time - 1605
            maxPeriodTime = 900
            period = 'long break'
            break
        default:
            time = longBreak ? time - 2505 : time - 1905
            maxPeriodTime = 105
            period = 'flex2'
            break
    }

    console.log(time) 
    //Adds 1 to time since it starts at 0, so that the percent
    //will actually hit 100%
    let percent = (((time+1)/maxPeriodTime)*100).toFixed(4)

    return {
        seconds : time,
        currentPeriod : period,
        currentPercent : percent,
        readableTime: parseReadableTime(maxPeriodTime, time)
    }
}

//Converts the seconds given by time into human-readable format.
function parseReadableTime(maxPeriodTime, time) {
    let minutes = Math.floor(maxPeriodTime/60) - Math.ceil(time/60)
    let seconds = 60 - (time % 60)

    //Values for flex periods if not wanting to just display 00:00
    /*
    if (maxPeriodTime === 105 && time < 45) {
        minutes = 1
        
        seconds = 45 - (time % 60)
    }

    if (maxPeriodTime === 105 && time > 44) {
        minutes = 0
        
        seconds = 60 - ((time + 15) % 60)
    }
    */

    if (String(minutes).length === 1) {
        minutes = '0' + minutes
    }

    if (seconds === 60) {
        seconds = '00'
    }

    if (String(seconds).length === 1) {
        seconds = '0' + seconds
    }

    //Plays chime at the start of every period.
        if (time === 0) {
            document.querySelector('audio').play()
        }

    if (maxPeriodTime === 105) {

        if (time % 2 == 0) {
            minutes = '00'
            seconds = '00'
        }else{
            minutes = '\xa0'
            seconds = '\xa0'
        }
    }
    
    return [minutes, seconds]
}

// Volume controls
const icons = Array.from(document.querySelectorAll('svg'))
icons.forEach(e => e.addEventListener('click', muteUnmute))

document.querySelector('#volume').addEventListener('change', adjustVolume)

function muteUnmute() {
    const audio = document.querySelector('audio')
    const volOff = document.querySelector('#volOff')
    const volOn = document.querySelector('#volOn')
    
    if (audio.muted === true) {
        audio.muted = false
        volOff.classList.toggle('hidden')
        volOn.classList.toggle('hidden')

    } else {
        audio.muted = true
        volOff.classList.toggle('hidden')
        volOn.classList.toggle('hidden')
    }
}

function adjustVolume() {
    document.querySelector('audio').volume = document.querySelector('#volume').value/100
    localStorage.setItem('volume', `${document.querySelector('#volume').value/100}`)
}
