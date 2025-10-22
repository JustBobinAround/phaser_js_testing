# Game Mechanics

# Character Stats
Items should primarily drive the stats of the character. However, character
stats should act as a gate towards items. Leveling does nothing for the player
except provide skill points that a user may allocate toward a few primary
skills:

- Strength
- Endurance
- Dexterity
- Intelligence
- Mana
- Luck

Items will be "gated" by skill allocation, e.g. a sword requires 5 strength to use.

# Item stats
An item has the following primary stats:

- Attack
- Defence
- Critical Chance
- Critical Factor
- Luck
- Range
- Mana Consumption
- Stamina Consumption
- Reload speed/Rate of attack

An item may have additional special powers. The list of which is TBD.

All players and enemies have a health of 100. Actual damage is determined by (Attack/(Defence*S)) where S is some constant that is TBD.

An items "power level" is determined by the overall z score of different items' stats in the game.
