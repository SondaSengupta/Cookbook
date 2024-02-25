## Null checking in C# for empty arrays within an array within an array
Given an address with an empty line 1:
```json
"address": [
 "line" : []
]
```
The first code line will fail, even with null checks, but the second will check whether there is an object within the line array.
```C#
location?.Address?.Line?[1]; //will produce a "Index was out of range. Must be non-negative and less than the size of the collection."
location?.Address?.Line?.ElementAtOrDefault(1) ?? ""; //will give empty string and not fail.
```
