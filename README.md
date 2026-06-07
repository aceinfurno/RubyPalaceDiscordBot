# Ruby Palace RPG Engine

Ruby Palace is a TypeScript-based RPG engine that uses Discord as the client interface while a centralized game server manages sessions, combat, inventory, rewards, and persistent player data.

The project focuses on modular game architecture, extensible systems, and state-driven gameplay logic rather than simple command handling.


## Technology Stack

- TypeScript
- Node.js
- Discord.js
- Prisma ORM
- SQLite
- Git

```

Discord User
       │
       ▼
Discord Interface Layer
       │
       ▼
Game Session
       │
 ┌─────┼─────┐
 ▼     ▼     ▼
States Battle Inventory
       │
       ▼
Registries & Factories 
       │
       ▼
Prisma ORM
       │
       ▼
SQLite Database
```
The Discord layer acts as a client interface while the Ruby Palace engine manages gameplay systems independently. This separation allows alternative clients, such as web applications or REST API consumers, to be added without major changes to core game logic.

```
Ruby Palace
│
├── Session System
│   ├── GameSession
│   ├── State Stack
│   ├── State Registry
│   └── Game States
│       ├── Start Menu State
│       ├── Main Menu State
│       ├── Inventory State
│       └── Battle State
│
├── Battle System
│   ├── Battle Manager
│   ├── TurnFlow
│   ├── Enemy AI
│   ├── Actions
│   │   ├── Basic Attack
│   │   ├── Skills
│   │   ├── Weapon Special Abilities
│   │   └── Use Item Action
│   └── Rewards
│
├── Character System
│   ├── Players
│   ├── Enemies
│   └── Classes
│
├── Item System
│   ├── Inventory
│   ├── Equipment
│   └── Usable Items
│
└── Registry and Factory System
    ├── Action Registry
    ├── Item Registry
    ├── Enemy Registry
    └── Class Registry


```

## Technical Highlights

- Client-server architecture using Discord as the user interface layer
- Session-based game management for independent player experiences
- State-driven navigation and gameplay flow
- Persistent player progression using Prisma and SQLite
- Turn-based combat with enemy AI, inventory management, and rewards

## Design Philosophy

Ruby Palace is designed around modular systems that can be expanded without requiring changes to existing gameplay logic.

The engine utilizes interface-driven abstractions, registry-based factories, and state-driven workflows. Core systems depend on contracts rather than concrete implementations, reducing coupling and supporting long-term maintainability as the project grows.

## Extensibility Features

Examples of extensibility within the engine include:

- New enemies can be added through the Enemy Registry without modifying battle flow.
- New actions can be registered through the Action Registry and immediately become available to combat systems.
- New game states can be introduced through the State Registry while preserving existing navigation behavior.
- Combat actions implement a common action interface, allowing abilities, attacks, and item effects to integrate through a shared execution contract.
- Enemy AI implements a shared behavior interface, enabling unique decision-making logic while remaining compatible with battle processing.
- Character classes follow a common class contract, allowing new classes to be introduced through registration rather than modification of existing systems.
- Registries and factories provide dynamic creation of actions, items, enemies, and classes from identifiers.

## Current Features

- Persistent player progression
- Character classes
- Turn-based combat
- Enemy AI
- Consumable item usage in battle
- Battle rewards and progression
- Session-based gameplay
  
## Roadmap

### In Progress
- Inventory viewing and navigation
- Equipment system
- Equip/unequip item flow
- Expanded item effects

### Planned
- Status effects
- Additional classes
- REST API support
- Web client interface
- Automated testing

# Screenshots

## 1. Character Creation
### Welcome Screen

<img width="478" height="150" alt="Screenshot 2026-06-07 005511" src="https://github.com/user-attachments/assets/9c02ae98-a2a0-4247-b7af-cf71ae537ade" />

### Name Entry (1)

<img width="455" height="176" alt="Screenshot 2026-06-07 005523" src="https://github.com/user-attachments/assets/79afd173-23c0-4309-b092-4dbb4b738db4" />

### Name Entry (2)

<img width="484" height="312" alt="Screenshot 2026-06-07 005540" src="https://github.com/user-attachments/assets/cdb25eaa-01ca-437f-9e7f-28965c1cf9b8" />

### Class Selection


<img width="479" height="290" alt="Screenshot 2026-06-07 005558" src="https://github.com/user-attachments/assets/52b45926-e1c2-4ffb-b2d4-f62a6b5c6055" />

### Confirm Character

<img width="379" height="208" alt="Screenshot 2026-06-07 005609" src="https://github.com/user-attachments/assets/992766cf-0271-48fb-8320-2c556c228bd8" />

## Main Menu

<img width="464" height="320" alt="Screenshot 2026-06-07 005619" src="https://github.com/user-attachments/assets/5a9ce7c1-1721-4e35-b416-0a44db93ad44" />

## Turn Based Combat

### Initial Battle Screen


<img width="339" height="453" alt="Screenshot 2026-06-07 005645" src="https://github.com/user-attachments/assets/c0275b36-bc5d-4825-9362-7c5532d8264b" />

### Skill Selection

<img width="185" height="52" alt="Screenshot 2026-06-07 005656" src="https://github.com/user-attachments/assets/a1febbe2-cc0e-426c-89af-ef165063db8a" />

### Target Selection (1)

<img width="231" height="61" alt="Screenshot 2026-06-07 005708" src="https://github.com/user-attachments/assets/7a040b9c-8d9f-4abe-9546-9c9826e80898" />

### Target Selection (1)

<img width="250" height="48" alt="Screenshot 2026-06-07 005716" src="https://github.com/user-attachments/assets/af656762-316d-4d85-9fe1-261a2760179a" />

### Battle Log

<img width="325" height="91" alt="Screenshot 2026-06-07 005740" src="https://github.com/user-attachments/assets/19e6a6f0-687f-46ed-9b12-0b16b10ebc68" />


## Inventory and Consumables

### Item Display

<img width="171" height="56" alt="Screenshot 2026-06-07 005755" src="https://github.com/user-attachments/assets/c31e8a32-d420-4106-8f2a-e4acbaf272d5" />

### Item Usage

<img width="357" height="17" alt="Screenshot 2026-06-07 005810" src="https://github.com/user-attachments/assets/7365c6d2-52c1-4cdb-8823-dc45d74d5c1c" />

### Item Count after Use

<img width="126" height="53" alt="Screenshot 2026-06-07 005820" src="https://github.com/user-attachments/assets/e5251a1b-395a-488d-b276-3c2b7898f9d2" />

## Victory Screen with Rewards

<img width="167" height="123" alt="Screenshot 2026-06-07 005856" src="https://github.com/user-attachments/assets/d9a19bfd-c182-4764-b2be-efccbf146da6" />
