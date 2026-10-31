# Context data in JavaScript

[SEAL's ContextData reference](https://github.com/microsoft/SEAL/blob/main/native/src/seal/context.h)
describes the precomputed values. These are the JavaScript return shapes:

| Accessor                                                                                           | JavaScript result                         |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `totalCoeffModulus()`, `plainUpperHalfIncrement()`, `upperHalfThreshold()`, `upperHalfIncrement()` | `BigUint64Array`                          |
| `coeffDivPlainModulus()`                                                                           | `{ operand: bigint, quotient: bigint }[]` |
| `plainUpperHalfThreshold()`, `coeffModulusModPlainModulus()`                                       | `bigint`                                  |
| `smallNttTables()`, `plainNttTables()`                                                             | `NTTTables[]`                             |
| `relinKeys.key()`, `galoisKeys.key()`                                                              | `PublicKey[]`                             |

Constant arrays and operand objects are independent JS copies. Word and residue
order follow the native arrays. Unavailable array fields return empty arrays.

NTT tables are native handles that keep their context alive. Calling
`getFromRootPowers(index)` or `getFromInvRootPowers(index)` returns an operand
object; omitting the index copies the whole array. Individual evaluation keys
are independent native copies.

Arrays of handles need cleanup for each element. With `DisposableStack`, you can
return JS values while disposing all the tables on exit:

```javascript
function nttRoots(contextData) {
  using cleanup = new DisposableStack()
  const tables = contextData.smallNttTables()
  for (const table of tables) cleanup.use(table)
  return tables.map(table => table.getRoot())
}
```

For runtimes without `DisposableStack`, delete each handle in `finally`. See
[object lifetime](advanced.md#object-lifetime) for the general cleanup rules.
