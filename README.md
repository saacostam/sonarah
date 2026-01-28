# Sonarah

- App for creating playlists or dj sets (music permutations) by matching a reference track

# TODO
- [x] Create skeleton page for auth-guard
- [x] Create Empty-Search for playlists
- [x] Create Empty-Search for manage-playlist (playlist-by-id)
- [x] Create custom Suspense-Boundary for lazy-loaded routes
- [x] Break-down my-playlists into components
- [x] Move add-item logic from modal-manager to component (app layer), in match-playlist
- [x] Clean-up (double) notifications for create playlist logic in match-playlist
- [x] Create playlist options with tabs, for recommendations card
- [x] Validate integration tests written for my-playlists
- [x] Try to use web-player first, and fallback to api call for web-player actions: seek, pause, play, etc. NOTE: Only for seek
- [x] (TransferPlayback) src/features/web-player/ui/transfer-playback.tsx - Move onError notification to the consumer}
- [x] Test for Search Tracks
- [ ] Test for Search Playlists
- [ ] Create single-method for both creating new playlist and adding tracks to playlist (match-playlist)
    - We current handle it using onSuccess callbacks; ideally it's a single async promise.
- [ ] Create error page for auth-guard
- [ ] Create error page for home screen (and add unit test)
- [ ] Investigate act wrapper alert when running tests
