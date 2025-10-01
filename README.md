# NDX: Sentinel Comics RPG Dice Roller

- [NDX: Sentinel Comics RPG Dice Roller](#ndx-sentinel-comics-rpg-dice-roller)
	- [How to use](#how-to-use)
	- [Creating a character](#creating-a-character)
		- [Saving your character](#saving-your-character)
		- [Format](#format)
		- [Dice sizes](#dice-sizes)
		- [Powers \& Qualities](#powers--qualities)
		- [Status](#status)
		- [Abilities](#abilities)
			- [Identity](#identity)
			- [Required](#required)
			- [Effects](#effects)
				- [Icons](#icons)
				- [Dice](#dice)
		- [Description](#description)
	- [Known bugs](#known-bugs)

## How to use

## Creating a character

Click the edit button in the title of the Abilities section to edit the character. Characters are defined via plain text with specific formatting, as described below.

### Saving your character

The character is saved automatically when you click "Set Character" in the editing window. It's saved to your browser's local storage, so it will be there when you come back or if you reload the page.

Currently only a single character is supported at a time. I intend to allow storing multiple characters in the future. In the mean time, you could always copy the text and save it in notepad or whatever your preffered format is, then paste it back in to swap characters.

### Format

The first two lines _must_ be the character's name followed by a blank line.

After that, there are four sections which can be put in any order; Powers, Qualities, Status, and Abilities. All sections are required.

Each section must be separated by blank lines, and you can not have any blank lines within a section.

The first line of each section should be the name of the section.

Here's an example of a minimal template:

```
Johnny Hero

Powers

Qualities

Status 6, 8, 10

Abilities
```

### Dice sizes

In the powers, qualities, and status sections you will need to list dice. Dice can be written with or without a `d` (i.e. `d6` and `6` are equivalent). Only dice of sizes 4, 6, 8, 10, or 12 are allowed.

### Powers & Qualities

The Powers and Qualities sections consist of their heading (`Powers` or `Qualities`), followed by each power or quality on its own line in the format `Power Name d6` or `Power Name 8`.

Example:

```
Powers
Cosmic 10
Mind Tentacles 8
Telekinesis 10
Remote Viewing 8
Absorption 8

Qualities
Self-Discipline 12
Otherworldy Mythos 8
Siren's Song 8
```

### Status

The status section always consists of a single line; the word "Status" followed by 3 dice, indicating respectively the green, yellow, and red status dice for the character.

Example:

```
Status 6, 8, 10
```

This indicates a Green d6, Yellow d8, and Red d10.

### Abilities

This is where things get complicated. Sorry. I swear it's not too bad, though!

Let's start with a look at an example ability and I'll break down its format.

```
g:Psychic Assault :: p:Telekinesis :: a:d h:n :: Attack using Telekinesis. Hinder the target using your Min die.
```

First thing to note is that this line can be broken into four distinct sections separated by double colons

- [Identity:](#identity) `g:Psychic Assault` = a Green (`g`) power named Psychic Assault.
- [Required:](#required) `p:Telekinesis` = Requires the power (`p`) Telekinesis. Make sure the power or quality is listed in the appropriate section and you match its spelling exactly!
- [Effects:](#effects) `a:d h:n` = Two effects; an attack (`a`) using mid die (`d`); and a hinder (`h`) using min die (`n`)
- [Description:](#description) `Attack using Telekinesis. Hinder the target using your Min die.` = Uhh... I feel like this one's kind of self explanatory?

Note that for each ability, only the identity and effects are required. So for example if you were putting in a Principle ability (which never have requirements) and didn't feel like typing up the description, you could just write `g:Principle of the Sea :: o:x`.

Now let's talk about how each of these sections are defined.

#### Identity

Always the first section of the ability. **Mandatory.**

- Just a letter for the color (`g`, `y`, `r`, or `o` for Green, Yellow, Red, and Out, respectively)
- Then a colon, and the name of the ability.

Examples:

- `g:None shall pass!`
- `y:I've had worse.`
- `r:It's just a flesh wound.`
- `o:Alright. We'll call it a draw.`

#### Required

Must be the second section, if present. **Optional.**

- Much like Identity above, the first letter (`p` or `q`) indicating whether the requirement is a power or quality.
- Then a colon, and the name of the power or quality.
- **IMPORTANT!** Make sure the power or quality is listed in the appropriate section, and **the name exactly matches**! If you have the quality `Siren's Song d10`, you must refer to it as `q:Siren's Song`. `q:Sirens Song` will **not** work.

#### Effects

Here's the fun part, the effects! Also the most cryptic part, and probably looks the scariest.

An effect consist of icons, a colon, and dice, each represented by 1 or more letters. `d:d` means "defend icon, mid die". `hr:x` means "hinder and recover icon, max die`.

An ability can have multiple effects, which are separated by spaces and/or commas. `a:d h:n` gives two separate effects, an attack with the mid die and a hinder with the min die.

##### Icons

| <img src="public/icons/action/attack.png" style="height:24px"> | <img src="public/icons/action/defend.png" style="height:24px"> | <img src="public/icons/action/boost.png" style="height:24px"> | <img src="public/icons/action/hinder.png" style="height:24px"> | <img src="public/icons/action/overcome.png" style="height:24px"> | <img src="public/icons/action/recover.png" style="height:24px"> |         |
| :------------------------------------------------------------: | :------------------------------------------------------------: | :-----------------------------------------------------------: | :------------------------------------------------------------: | :--------------------------------------------------------------: | :-------------------------------------------------------------: | :-----: |
|                              `a`                               |                              `d`                               |                              `b`                              |                              `h`                               |                               `o`                                |                               `r`                               |   `-`   |
|                             attack                             |                             defend                             |                             boost                             |                             hinder                             |                             overcome                             |                             recover                             | no icon |

**Note:** `-` is special, and indicates the effect has no icon. `-` only works if it's the only "icon" for that effect. e.g. `-:d`, but not `-a:d`.

##### Dice

| Min | Mid | Max |
| :-: | :-: | :-: |
| `n` | `d` | `x` |

Specifying multiple dice will cause them to be added together. e.g. `a:dx` is an attack with Mid+Max. But see [bugs](#known-bugs) below.

**Tip:** Hey, this thing is called NDX! What a weird coincidence. Also, how is this a tip?

### Description

Always the last section, if present. **Optional.**

Should be pretty self explanatory. Whatever you write here will be shown in the abilities list and in any rolls made with the ability. Pretty much anything flies here. Except double colons, which the app uses to help decode the ability. So don't put `::` in your description. Or do. IDGAF, it's your ability.

## Known bugs

- Currently effects using more than one die (e.g. `a:dx`) are broken. Should have this fixed quickly once I get time to look into it.
