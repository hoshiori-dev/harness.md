# Writing the Anchor Document

Read when the plan writes or updates an anchor document,
before building the last layer.

## After the last layer

Write a new anchor only if its planned route fits the entrypoint's budget.
Otherwise record both as pending.
Use the format skill to write or update and validate the anchor,
recording only realised, authorised decisions.
Checkpoint a new anchor and its route together.

## When the Entropy self-check requires a new anchor

The self-check would fail on a file that does not exist yet,
and would not be configured for it. So:

1. Build Entropy last.
   Hand its builder the anchor's path as a file that follows the layer,
   so it configures the self-check for that path
   and reports the missing file as expected.
2. Hold the Entropy checkpoint.
3. Write the anchor and its route.
4. Run the self-check recipe again.
   Check that its settings name the anchor's path.
5. Once it passes, checkpoint Entropy, the anchor, and the route together.

If the anchor cannot be written,
have the Entropy builder drop it from the self-check
before the layer is committed.
