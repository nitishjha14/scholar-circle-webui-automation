# Scholar Circle: Authentication Test Cases (v1.0)

**Source:** `auth-user-journey.md` v0.3 (all behavior confirmed manually on 2026-10-07)
**App:** https://scholar-circle-psi.vercel.app/
**Suggested location in repo:** `docs/test-cases/auth.md`

## Conventions

| Priority | Tag | Meaning | When it runs |
|---|---|---|---|
| P1 | `@smoke` | If this breaks, the app is unusable | Every change |
| P2 | `@regression` | Important behavior, app still works without it | Before release / nightly |
| P3 | `@edge` | Unusual or low-impact cases | Full runs |

- **Starting state** tells you whether the spec file runs as a guest (no saved session) or logged in (saved `storageState`).
- **Source** points back to the journey (J) or negative scenario (N) in the journey document.
- Error texts are listed once in the Test data section and should live in a constants file.

## Test data

| Item | Value |
|---|---|
| Existing user | `test@test.com` (password from `.env`, never committed) |
| New user email | Generated per run, e.g. `qa.${Date.now()}@example.com` |
| New user password | 8+ characters, from `.env` or generated |
| Wrong password | Any string different from the real one |
| Unregistered email | Generated, e.g. `nouser.${Date.now()}@example.com` |
| Short password | 5 characters |
| Invalid credentials message | `Invalid credentials. Please check the email and password.` |
| Duplicate email message | `A user with the same id, email, or phone already exists in this project.` |
| Short password message | ``Invalid `password` param: Password must be between 8 and 256 characters long.`` |
| Valid post ID | One stable existing post, e.g. `68b8b2cd001c19250039` (see TC-AUTH-022) |

---

## 1. `login.spec.js`

**Starting state:** guest

| ID | Title | Pri | Steps | Expected | Source |
|---|---|---|---|---|---|
| TC-AUTH-001 | Login with valid credentials | P1 | 1. Open `/login` 2. Enter valid email and password 3. Click **Sign in** | Lands on Community Feed; header shows Logout; Login and Signup links are gone | J2 |
| TC-AUTH-002 | Login with wrong password shows error | P2 | 1. Open `/login` 2. Enter real email and a wrong password 3. Click **Sign in** | Invalid credentials message shown; URL still `/login`; header still guest nav | N2 |
| TC-AUTH-003 | Login with unregistered email shows the same error | P2 | 1. Open `/login` 2. Enter an unregistered email and any password 3. Click **Sign in** | Same invalid credentials message as TC-AUTH-002 (no hint about which emails exist); URL still `/login` | N3 |
| TC-AUTH-004 | Login with empty fields does not submit | P3 | 1. Open `/login` 2. Click **Sign in** with both fields empty | URL still `/login`; no request is sent; a field is marked invalid (browser validation) | N1 |
| TC-AUTH-005 | Login with email missing `@` is blocked | P3 | 1. Open `/login` 2. Enter `abc` as email and any password 3. Click **Sign in** | URL still `/login`; email field is marked invalid (browser validation) | N4 |
| TC-AUTH-006 | Sign In button on landing page opens login | P2 | 1. Open `/` 2. Click **Sign In** | URL is `/login` | J2 |

## 2. `signup.spec.js`

**Starting state:** guest

| ID | Title | Pri | Steps | Expected | Source |
|---|---|---|---|---|---|
| TC-AUTH-007 | Signup with valid data logs the user in | P1 | 1. Open `/signup` 2. Enter full name, a new unique email, valid password 3. Click **Create Account** | Account is created; user lands on Community Feed; header shows Logout | J1 |
| TC-AUTH-008 | Get Started button on landing page opens signup | P2 | 1. Open `/` 2. Click **Get Started** | URL is `/signup` | J1 |
| TC-AUTH-009 | Signup with an existing email shows error | P2 | 1. Open `/signup` 2. Enter full name, `test@test.com`, valid password 3. Click **Create Account** | Duplicate email message shown; user stays on `/signup`; not logged in | N5 |
| TC-AUTH-010 | Signup with a short password shows error | P2 | 1. Open `/signup` 2. Enter full name, new email, 5-character password 3. Click **Create Account** | Short password message shown; user stays on `/signup`; not logged in | N6 |
| TC-AUTH-011 | Signup with empty Full Name does not submit | P3 | 1. Open `/signup` 2. Leave Full Name empty, fill the rest 3. Click **Create Account** | URL still `/signup`; no account is created; Full Name is marked invalid | N7 |
| TC-AUTH-012 | Signup with email missing `@` is blocked | P3 | 1. Open `/signup` 2. Fill all fields with `abc` as email 3. Click **Create Account** | URL still `/signup`; email field is marked invalid (browser validation) | N8 |

## 3. `route-protection.spec.js`

**Starting state:** guest

| ID | Title | Pri | Steps | Expected | Source |
|---|---|---|---|---|---|
| TC-AUTH-013 | Guest opening `/add-post` is redirected to login | P1 | 1. Open `/add-post` directly | URL becomes `/login`; the post form is not shown | J5 |
| TC-AUTH-014 | Guest opening `/your-posts` is redirected to login | P1 | 1. Open `/your-posts` directly | URL becomes `/login`; no posts are shown | J5 |
| TC-AUTH-015 | Guest opening a post URL is redirected to home | P2 | 1. Open `/post/<valid post ID>` directly | URL becomes `/`; landing page shown; post content not shown | J5 |

## 4. `session.spec.js`

**Starting state:** logged in (saved session)

| ID | Title | Pri | Steps | Expected | Source |
|---|---|---|---|---|---|
| TC-AUTH-016 | Session persists after page refresh | P1 | 1. Open the Community Feed 2. Refresh the page | Still logged in; header still shows Logout; feed is shown | J3 |
| TC-AUTH-017 | Logged-in user opening `/login` is redirected to the feed | P2 | 1. Open `/login` directly | Redirected to the Community Feed; login form not shown | J6 |
| TC-AUTH-018 | Logged-in user opening `/signup` is redirected to the feed | P2 | 1. Open `/signup` directly | Redirected to the Community Feed; signup form not shown | J6 |

## 5. `logout.spec.js`

**Starting state:** logged in (fresh login or saved session; each test must end the session, so use a **separate login per test** rather than the shared saved session, otherwise other tests lose their login)

| ID | Title | Pri | Steps | Expected | Source |
|---|---|---|---|---|---|
| TC-AUTH-019 | Logout switches the header to the guest nav | P1 | 1. On the Community Feed, click **Logout** | Header shows Home, Login, Signup; Logout and Add Post are gone | J4 |
| TC-AUTH-020 | After logout and refresh the landing page is shown | P2 | 1. Click **Logout** 2. Refresh the page | Landing page ("Share Your Learnings with the World") is shown | J4 |
| TC-AUTH-021 | Back button after logout does not expose protected content | P2 | 1. Click **Logout** 2. Press browser Back | Login page is shown; no protected content | J7 |
| TC-AUTH-022 | Clicking a post on the stale page after logout goes to login | P3 | 1. Click **Logout** while on the feed 2. Click a post card on the still-visible page | Login page is shown | J8 |

---

## Summary

| Spec file | Cases | P1 | P2 | P3 |
|---|---|---|---|---|
| `login.spec.js` | 6 | 1 | 2 | 3 |
| `signup.spec.js` | 6 | 1 | 3 | 2 |
| `route-protection.spec.js` | 3 | 2 | 1 | 0 |
| `session.spec.js` | 3 | 1 | 2 | 0 |
| `logout.spec.js` | 4 | 1 | 2 | 1 |
| **Total** | **22** | **6** | **10** | **6** |

## Notes

- **Not covered:** double-click on **Sign in** / **Create Account** (N9). It was not checked manually. Add it once an automated test shows how the app behaves.
- **TC-AUTH-015** needs a post that stays in the database. Use one post you will not delete, or create a post in setup.
- **TC-AUTH-007** creates a real account in Appwrite on every run. This is fine for this practice project, but the accounts will pile up.
- **Browser-native validation cases** (TC-AUTH-004, 005, 011, 012) have no page text to assert on. Check the URL and the field's validity instead.
- **Logout tests** end the session, so they need their own login. Do not use the shared saved session for them (see section 5).
- Edit, delete and create-post tests are out of scope here. They belong in the post-management journey.
