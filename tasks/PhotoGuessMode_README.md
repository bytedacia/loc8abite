# Photo Guess Mode Implementation Steps

This document provides a step-by-step guide to implement the Photo Guess Mode in the Loc8abite project.

## 1. UI Preparation

- [x] Add a new button or menu entry to select "Photo Guess Mode" in the main UI.
- [x] Create a modal or dedicated section to display the static photo for guessing.
- [ ] Add a "Start Photo Guess" button to trigger the mode.
- [x] Add a "Submit Guess" button for the user to confirm their guess.

## 2. Image Handling

- [x] Prepare a set of static food/location images (local or remote URLs).
- [x] Create a function to randomly select and display one image per round.
- [x] Ensure the image is shown clearly and responsively in the UI.

## 3. Map Integration

- [x] Display the Google Map next to or below the image.
- [x] Allow the user to place a marker on the map to indicate their guess.
- [x] Ensure only one marker can be placed per round.
- [x] Add logic to reset the marker for new rounds.

## 4. Guess Submission & Scoring

- [x] On "Submit Guess", record the marker's coordinates.
- [x] Store the correct coordinates for the displayed image (hardcoded or from a data file).
- [x] Calculate the distance between the guess and the correct location using the existing haversineDistance function.
- [ ] Display feedback: distance, phrase, and score.
- [ ] Optionally, show the correct location on the map after guessing.

## 5. Feedback & Results

- [x] Show a modal or result section with the user's distance and a feedback phrase.
- [ ] Optionally, trigger confetti or animations for close/accurate guesses.
- [x] Add a "Next Photo" or "Play Again" button to start a new round.

## 6. Score & Achievements Integration

- [ ] Integrate with the existing ScoreSystem for scoring and combos.
- [ ] Update achievements if relevant (e.g., first photo guess, perfect photo guess).
- [ ] Update and display high score if beaten.

## 7. Responsive Design

- [ ] Ensure the image and map layout works on both desktop and mobile.
- [ ] Test resizing and adjust CSS as needed.

## 8. Testing

- [ ] Test with multiple images and locations.
- [ ] Test edge cases (no marker, double submission, etc.).
- [ ] Fix any bugs and polish the user experience.
