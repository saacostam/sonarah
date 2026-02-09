# 🎹 Sonarah

Sonarah is a Spotify-powered playlist matching tool for people who care about flow, mood, and intent — not just collections of tracks.

Instead of generating playlists automatically, Sonarah helps you *curate by comparison*: you take a playlist you trust and match it track-by-track with new music that feels right in the same position.

---

## The Core Idea

> *"If you like this track here, what would you put next to it?"*

Sonarah is built around **one-to-one matching**:

* You choose a **reference playlist**
* For each track in that playlist, you select a **matching track**
* The result is a new playlist that mirrors the original’s **energy, mood, and flow** — without copying it

This keeps humans in the loop while still accelerating discovery.

---

## Main Product Flow

Sonarah’s experience is intentionally structured around playlists as creative units.

### 1. Select a Playlist

From **My Playlists**, you can:

* Browse playlists you follow or own
* Search for playlists
* Create new playlists
* Unfollow or delete playlists

This is the starting point for all other actions.

---

### 2. Manage a Playlist

Inside a playlist, you can:

* Search for tracks
* Add tracks
* Remove tracks
* Reorder tracks

This step is about shaping the **reference material**. The quality of the matching experience depends on how intentional the source playlist is.

---

### 3. Match a Playlist

This is Sonarah’s core interaction.

#### Reference Playlist

* Displays the original playlist
* Tracks are matched **in order**, one-to-one

#### Matched Playlist

* Each reference track corresponds to a single match slot
* The matched playlist is built progressively as selections are made

#### Match Track Panel

* Presents candidate tracks sourced from Spotify recommendations and search
* Tracks can be previewed using a built-in web player
* Selection is based on perceived fit, not algorithmic scoring

The goal is to create a playlist that *feels right* in the same sequence as the reference.

---

## Design Philosophy

### Human-Led Curation

Sonarah does not auto-generate playlists. It supports deliberate, track-level decisions by the user.

### Structure Over Similarity

Matching is about contextual placement within a playlist, not finding globally similar tracks.

### Playlists as Creative Artifacts

Playlists are treated as authored objects with internal logic, pacing, and narrative.

---

## Why Matching Instead of Traditional Recommendations?

Traditional recommendation systems answer:

> *"What else might I like?"*

Sonarah answers:

> *"What belongs **here**, at this point in the playlist?"*

This makes Sonarah especially useful for:

* Rebuilding or reinterpreting existing playlists
* Translating a vibe across genres or eras
* Long-form listening sessions where sequencing matters
* DJs, selectors, and intentional listeners

---

## What Sonarah Is (and Isn’t)

**Sonarah is:**

* A playlist curation tool
* A discovery aid grounded in context
* A way to reason about playlists structurally

**Sonarah is not:**

* A one-click playlist generator
* A ranking or scoring engine
* A passive recommendation feed

---

## Current Limitations

* Sonarah relies on the Spotify Web API
* Spotify’s recommendations endpoint is deprecated, which limits the quality and longevity of automated candidate generation
* As a result, discovery currently depends more heavily on search and remaining recommendation surfaces

These constraints directly shape the current product experience.
