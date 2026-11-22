# CV website

A one-page personal CV site for a self-taught full-stack developer who is looking for an internship or a first job. It is meant to be scanned by a recruiter in under a minute.

## Language

**Section**:
A top-level block of the page with a heading (About Me, Skills, Education, Experience, Projects, Contact). Most Sections have a link in the navigation.
_Avoid_: Block, panel, tab

**Entry**:
One item in a timeline: a date line and a Card, for example one school or one internship.
_Avoid_: Item, row, event

**Card**:
A raised box that holds the content of one Entry or one project.
_Avoid_: Tile, box

**Pill**:
A small rounded label for a topic, skill or link. A pill can be a link (for example "View on GitHub").
_Avoid_: Chip, tag

**Badge**:
A small status or stat label next to a title or date, such as "In progress" or "300K+ downloads". Not a Pill, because it states a fact about the Entry or project instead of naming a topic.
_Avoid_: Label, tag

**Timeline**:
An ordered list of Entries, newest last, with a date on one side and a Card on the other. Used for Education and Experience.

**Experience**:
Internships and work placements shown as a Timeline. Education is separate and covers studies.

**Availability**:
What the status line in the hero says about the developer's search. Kept general until a specific start date for the 2027 internship is known.

## Relationships

- A **Section** holds **Entries** (in a **Timeline**) or **Cards** (in a grid), or plain text.
- An **Entry** has one date range, one **Card** and optionally a **Badge**.
- A **Card** has a title, a description and zero or more **Pills**.

## Flagged ambiguities

- "Chip" in the code and "pill" in conversation meant the same thing. Resolved: **Pill** is the term; the stylesheet still uses `chip-list` as a class name.
- "Education entry" was used for Internship cards too. Resolved: the class is now `timeline-card`.
- "Self-taught" versus formal education: the hero now says "Self-taught programmer, now studying full-stack .NET development".
