The Leadership Desk

This is the website I built for my 2027 Year 7 Year Level Coordinator Expression of Interest at Ferny Grove State High School.

I teach Digital Technologies, so I wanted the application itself to show a little of how I work rather than just attaching two PDFs and calling it done. The result is a small interactive site built around a desk. The formal application is still the important part. The interactive pieces simply let a reader open the evidence behind it if they want to go further.

This is not intended to be a generic leadership portfolio or a reusable application template. It is deliberately specific to me, the role I was applying for, and the examples I could genuinely support.

What the site contains

The site opens with the two documents the EOI actually required:

* a one-page Curriculum Vitae
* a one-page response to the two Key Capabilities

After that, the site moves into the evidence behind the application.

The main behaviour section explains the leadership approach I keep coming back to: know students early, hold the line, and keep the relationship. Rather than repeat that idea everywhere, I have tried to show it through a small number of actual examples.

The interactive desk contains six evidence areas:

1. Teaching + staff leadership
2. Behaviour investigation
3. Year 7 camp
4. Families + early intervention
5. Trauma-informed youth work
6. University excursion coordination

Four of those are marked START HERE so a reader does not have to click everything to find the strongest material.

There is also a Challenge My Application section. That exists because I have not previously held the Year Level Coordinator title. Instead of pretending that gap is not there, I chose three obvious questions a panel might still have and linked each one back to the evidence I think is relevant.

There is also a coffee easter egg because I could not quite bring myself to make the whole thing completely serious.

Why I built it this way

The first versions became too busy. I had too many evidence objects, too much explanation after each example, and too many sections saying essentially the same thing in slightly different words.

The current version is intentionally tighter:

* formal application first
* behaviour philosophy stated once
* six evidence objects instead of eight
* four clearly marked priority examples
* three challenge questions instead of six
* no hidden quick-scan mode
* no invented examples, metrics or outcomes to make the application sound more impressive than the evidence supports

The basic rule became: show the evidence, explain it only when the explanation adds something, and stop once the point has been made.

Repository structure

This is a plain static site. There is no framework, package manager or build process.

* index.html contains the page structure
* styles.css contains the layout, desk artwork, responsive behaviour and visual styling
* content.js holds the evidence, behaviour principles and challenge content
* app.js handles the dialogs, interactions and rendering of that content
* James_Fehlberg_2027_Y7_YLC_CV.pdf is the one-page CV
* James_Fehlberg_2027_Y7_YLC_Key_Capabilities.pdf is the one-page capability response
* qr.html is a small helper page I used to generate a QR code for the deployed site
* .nojekyll keeps GitHub Pages from trying to process the site through Jekyll

Running it

Because it is just HTML, CSS and JavaScript, the simplest option is to open index.html in a browser.

If you want to test it through a local web server instead, run one from the repository folder and open the local address it gives you. For example:

python -m http.server 8000

Then open:

http://localhost:8000/

The repository is also set up to work as a GitHub Pages site without a build step.

A note on the QR page

qr.html is separate from the application itself. Once the site has a final HTTPS address, I can paste that address into the page, generate the QR code and download it for the printed application.

It uses the QRCode library from a CDN, so that helper page needs an internet connection when generating the code.

Privacy

This was built as a real employment application, not as a fictional demo, so I have tried to keep the public version appropriately restrained.

The site currently:

* asks search engines not to index or follow it using noindex, nofollow
* contains no analytics
* does not include my phone number or home address
* does not identify students involved in the examples

noindex is a request to search engines, not access control. Anyone with the public URL can still view the site, so I would review the content again before publishing or sharing a fork publicly.

If you are looking through the code

Most of the written evidence lives in content.js, which means the content can be edited without digging through the page markup. app.js then renders that material into the evidence and principle dialogs.

I kept the project deliberately lightweight. It does not need a framework to do what it is trying to do, and keeping it static also makes it easy to host, inspect and change.

That is really the whole project: a formal two-page EOI with an optional interactive layer behind it, built to make the evidence easier to explore without turning the application into a scavenger hunt.