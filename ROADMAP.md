# Roadmap

## Must-Haves
Features, fixes, and tests required before making the repository public.

- [x] Handle web player initialization error cases  
  - Authorization errors (e.g. non-Premium users)
  - Failed device initialization
- [ ] Happy-path test coverage for **Manage Playlist**
- [ ] Happy-path test coverage for **Match Playlist**

---

## Nice-To-Haves
Improvements that can be added after the repository is public.

### Testing
- [ ] Full test coverage for **Manage Playlist**
- [ ] Full test coverage for **Match Playlist**
- [ ] Add tests for **Search Playlists**
- [ ] Investigate `act(...)` wrapper warnings in test runs

### Observability
- [ ] Analytics (Mock)
  - [x] Add analytics adapter  
  - [ ] Light coverage for core user actions
- [ ] Add error logging adapter  
  - [ ] Light coverage for runtime errors

### UX / Error Handling
- [ ] Create error page for auth guard
- [ ] Create error page for home screen  
  - [ ] Add unit tests

### Internal Cleanup
- [ ] Unify playlist creation + track addition into a single async flow  
  - Currently handled via chaining `onSuccess` callbacks  
  - Goal: one async method returning a single promise
