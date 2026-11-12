# Where a Local Explanation Lives

Read when a candidate is a constraint, an invariant of one function,
a workaround, or an explanation of why some code looks wrong.

Choose the cheapest durable carrier, in this order:

1. **Type or signature**, when the constraint
   is a static invariant the language's types express readably:
   a non-empty list type, an enum instead of a string, a branded identifier.
   The compiler then enforces it at no standing context cost.
   Stop before type gymnastics:
   tensor shapes and highly dynamic constraints go in a docstring,
   because the compiler errors they produce cost more than they save.
2. **Comment beside the code**, when the reason is local or temporary:
   a historical workaround, a performance compromise,
   a pin held because of an upstream bug.
   It loads exactly when the code is read and dies with the code.
   The reason a module pins an old library version goes in a comment at the pin,
   not in a knowledge file; once the pin goes,
   the explanation goes with it instead of orphaning.
3. **Knowledge file**, only for what code cannot state:
   cross-cutting why, architecture intent, when to read what.

A request to document "this function
must never receive an empty list" gets a non-empty type
or a signature-level constraint and no knowledge entry.
In the section, write such a candidate as "carried by the code"
with the carrier named;
the change to the code itself is a suggestion in the hand back,
never an edit this layer makes.
