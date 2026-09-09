# Todoooooo
[] get er done

# brain
[] update project brain


# Guest list
[] only users that are only Rachel and I's guest list should be allowed into the website
[] can do this with a preset list in the db possibly by name or email, or we can just send the email with the website link out to everyone on our list we make via email, and they just put in a default password we give them, something like 'supercoolpasswordtopoolwedding2027'

# Misc
[] update favicon
[x] fix double rendering of "Rachel & Cameron": there is a Rachel & Cameron on both the page.tsx
as well as on the envelope message itself. Either replace the envelope one with a different message or something,
or just hide the Rachel & Cameron that you should see after opening the envelope (until envelope is open, aka should not be viewed from the landing page)
[x] add back arrow in top right corner (circle with arrow)
[] get real collage images (looks like urweddingbestie examples)
[] move images closer and overlap more
[x] add better typography to get same aesthetic
[x] initial envelope should look like a real envelope
    IMPORTANT:
    [] OPEN LIKE A REAL ENVELOPE (animation when clicked - just slides as of now, which doesnt look bad but might not be the EXACT animation we are going for)

[x] better font on front page (much more elegant)
[x] components need to fade in as user scrolls
[] remove vercel .svgs in public 
[] find music to play on card open (or just sound "open.mp3" in public AND add music to play when user clicks the record player component)
[] once envelope is open there should be an open envelope (duh) with an actual wedding invitation poking out of it
[] all components holding pictures in them should be detailed with wedding themed items (flowers, bows, etc..)
[] on mobile (probably on desktop too) background image jumps around when scrolling up or down

# More components to add
[] Registry (where should this go - in details or its own component)
[] "THE DETAILS" component: will have all the details of the wedding itself. Location, time, attire, theme, etc... 
    [] initialized
    [] could even include "ask a question section" - emails Rachel & I the question? 
    [] details
[] our story
    [] initialized
[] FAQ
    [] initialized
[] song component that is a record? 
[x] countdown component that is live and counting down 

# RSVP Page
[] when clicking between decline and accept the wallpaper resizes and has layout jank
[x] RSVP page aesthetics and form needs to be completed
[x] user can rsvp and this is persisted in neon
[] test functionality of this page and see if any other fields need to be added
[] when user adds a plus one (or guests) they see "guest 2" and not guest 1
    [] this should likely just be a plus one anyways, so constrain to a plus one? 
[] when user clicks decline they can still see diet restrictions and a note for the couple
[] update reply by to ____ (get this from Rachel)

# UI NEEDS TO BE PERFECT (elegant/old money/wedding vibes)
[] Entire makeover of the ui until Rachel's approval (old money/wedding vibe aesthetic)
    [x] step 1: get globals.css setup with ui theme
    [] step 2: 

# Email Service
[] need email service to update Rachel & I when an RSVP is made

# Deploy to Vercel
[x] testing on both desktop on mobile
[] ONLY ONCE FULLY COMPLETE AND TESTED -> production build hosted on Vercel