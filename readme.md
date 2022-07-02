# Pomo-Momo
A 24/7 pomodoro timer running on the same cycle for all timezones.

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, Node, Express

The timer calculates what cycle it should be on based off of the Unix epoch so multiple users can work together with the same breaks regardless of time zone with no connection or desynchronization errors.

## Optimizations
I wanted to make a timer app with as little setup and maintenance as possible, so it 'just works' and user action after loading the page is only necessary to work around browser autoplay restrictions.

## Lessons Learned:
How to construct an algorithm to calculate the needed result so code for the timer can run efficiently.

## Examples:
Live version at https://pomo-momo.herokuapp.com/
