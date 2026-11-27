# Writing the Anchor Document

Read when the plan writes or updates an anchor document,
before building the first layer.

## After the last layer

Write a new anchor only if its planned route fits the entrypoint's budget.
Otherwise record both as pending.
Use the format skill to write or update and validate the anchor,
recording only realised, authorised decisions.
The Knowledge builder writes a new anchor's route as a route owed;
checkpoint the two together.

## When the Entropy self-check requires a new anchor

The self-check would fail on a file that does not exist yet,
and would not be configured for it. So:

1. Build Entropy last.
   Hand its builder the anchor's path as a file that follows the layer,
   so it configures the self-check for that path
   and reports the missing file as expected.
   For a root file the user confirmed as the anchor,
   say that the file exists.
2. Hold the Entropy checkpoint.
3. Write the anchor, then hand its route to the Knowledge builder
   as a route owed.
4. Run the self-check recipe again.
   Check that its settings name the anchor's path.
5. Once it passes, checkpoint Entropy, the anchor, and the route together.

If the anchor cannot be written,
have the Entropy builder rebuild the layer
as for a project without an anchor document,
its self-check settings and every deposited mention,
before the layer is committed.
