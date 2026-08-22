---
title: Godot Swarm
summary: A C++ GDExtension that provides an all-in-one solution for handling thousands of physics simulated, animated, and pathfinding entities in Godot.
year: '2026-Present'
platform: Godot, GDExtension, godot-cpp
language: C++, GDScript
status: in progress
layout: engine
highlights:
  - value: '50,000'
    label: Active Entities
  - value: 87 FPS
    label: sustained FPS
  - value: 11.5 ms
    label: frame time
order: 2
writeup:
  title: Godot Swarm's Technicals
  cta: Technical details
hero:
  alt: The extreme benchmark running roughly 48,000 entities at once.
  video: /media/godot-swarm-benchmark.mp4
  poster: /media/godot-swarm-poster.jpg
  note: All entities in the scene are animated.The lag and blurriness is an artifact of the video not the scene.
  frames:
    - /media/godot-swarm-card.gif
shots:
  - src: /media/godot-swarm-01.gif
    alt: A tight cluster of flyer entities swarming a target indoor.
    caption: A tight cluster of flyer entities swarming a target indoor.
  - src: /media/godot-swarm-02.gif
    alt: ~50,000 entities pathfinding through a maze to reach the blue target.
    caption: ~50,000 entities pathfinding through a maze to reach the blue target.
  - src: /media/godot-swarm-03.gif
    alt: A swarm of multiple types of entities navigating through open terrain to reach a point.
    caption: A swarm of multiple types of entities navigating through open terrain to reach a point.
  - src: /media/godot-swarm-04.gif
    alt: Another swarm of ground and flying entities swarming a target.
    caption: Another swarm of ground and flying entities swarming a target.
metrics:
  heading: Metrics
  note: Production games will only ever reach the Light profile in an actual scenario, and even then 5,000 entiites should be a super rare occurence. These benchmarks go up to 50,000 entities for the sake of stress testing and profiling.
  columns:
    - Entities
    - Avg FPS
    - Frame time
    - 1% low
    - Max time
    - Memory
  machines:
    - name: Desktop
      score: '20,777'
      system:
        - label: OS
          value: Windows
        - label: CPU
          value: Ryzen 7 5800X, 16 threads
        - label: GPU
          value: Radeon RX 6900 XT
        - label: RAM
          value: 64 GB
      rows:
        - label: Base
          values: ['500', '1,133.55', 0.882 ms, 3.333 ms, 141.869 ms, 984.4 MB]
        - label: Light
          values: ['4,991', '591.45', 1.691 ms, 5.430 ms, 18.901 ms, 987.5 MB]
        - label: Normal
          values: ['9,941', '356.63', 2.804 ms, 8.670 ms, 21.371 ms, 989.2 MB]
        - label: Heavy
          values: ['22,168', '176.98', 5.650 ms, 16.021 ms, 35.860 ms, 991.5 MB]
        - label: Extreme
          tag: shown above
          values: ['48,519', '62.01', 16.127 ms, 62.093 ms, 148.864 ms, 999.1 MB]
    - name: Laptop
      score: '6,788'
      system:
        - label: OS
          value: Linux
        - label: CPU
          value: Ryzen 7 PRO 7840U, 16 threads
        - label: GPU
          value: Radeon 780M
        - label: RAM
          value: 30 GB
      rows:
        - label: Base
          values: ['500', '323.10', 13.696 ms, 112.282 ms, 112.282 ms, 999.0 MB]
        - label: Light
          values: ['4,998', '146.16', 13.267 ms, 41.008 ms, 46.790 ms, '1,001.0 MB']
        - label: Normal
          values: ['10,000', '90.73', 19.057 ms, 47.318 ms, 48.897 ms, '1,001.5 MB']
        - label: Heavy
          values: ['22,497', '46.43', 32.303 ms, 59.896 ms, 65.837 ms, '1,004.1 MB']
        - label: Extreme
          values: ['49,994', '16.38', 94.177 ms, 181.847 ms, 181.847 ms, '1,012.1 MB']
sections:
  - shots
  - metrics
  - writeup
---

## Background

A game I am working on is inspired by various games I've played such as Risk Of Rain 2, Megabonk, and Noita. Between all of them, there is one particular mechanic I wanted to perfect in order to create an accessible game for even low-end devices: Swarms. Swarms are just groups of entities, large groups, a swarm of 500, 1000, or even 10,000 entities. I wasn't sure if this was possible, given that my game was 3D and up to 4 player coop (which made things WAY more complicated).

Godot Swarm has been through several versions in its development, with each version being made to solve issues that the previous version had. However at its core, it is specifically made and catered towards a certain game I am currently working on.

In its initial stages, Godot Swarm was built directly as part of the game, and wasn't really a separate framework at the time. It was implemented in GDScript and was called Nexus. It was able to handle up to 500 entities, but with no animations (as animations were expensive at that number), and no pathfinding. They were like Megabonk's entities, they simply went towards a point, climbing any obstacles they faced in the way, except they had no physics. Their vertical position was based on springs and raycasts, and their horizontal position also relied on raycasts. They had partial collision support, with entities only in close proximity to the player gaining rigidbodies.

It was not the best, but it was also my first time working with Godot and GDScript, so it served fine. Eventually, I found an [open-source plugin](https://github.com/antzGames/OpenVAT-for-Godot) and integrated it into the project which eventually allowed me much more while having them be animated, however it was still not the best solution, as each entity was a set of nodes, and was implemented in a naive GDScript solution.

Work on the project stopped for a few months as I finished my semester, but eventually I resumed it and decided to rewrite it from scratch as a somewhat general purpose framework that specifically catered towards the game I was working on.

## Architecture

Godot Swarm is fundamentally different at every part than Nexus. I decided to rewrite it as a C++ GDExtension because I had finished taking related courses such as Operating Systems, C, Data Structures, etc. I figured that it'd be a nice project to work and learn from. The main goal this time was to create a framework that not only handled entities, but also made integrating them easily into any project.

The system is composed of a set of nodes and autoloads/singletons. Below are the *main* components that handle the core features of Godot Swarm:

## SwarmSystemRuntime (Node)
A node that serves as the entry point for the runtime modules. It is meant to be placed inside a scene as the root, and that scene is meant to be registered as an Autoload. This node is responsible for initializing all runtime modules such as the Director, Nexus, Renderer, Query, Monitor, Physics, and Atom modules. The SwarmSystemRuntime module is also responsible for managing each sub modules lifecycle.

It is also responsible for serving as the access point for all other modules in GDScript, by exposing various getters for the sub modules, returning their singletons. With this structure, various properties regarding rendering, multithreading, debug visualization, querying, and physics can be easily accessed and tweaked from the editor/gdscript runtime without needing to edit the GDExtension and recompiling.

## SwarmNexus (Object)
This object holds all the runtime data as well as settings. It holds things like pathfinding settings, collision settings, internal settings and variables, thresholds like max entity count, max physics entities count, and also contains certain inline helper functions. It could be organized better for sure, but it works perfectly fine and there's no way I'm touching the object that all other systems reference for storing data.

## SwarmDirector (Object)
This object is responsible for computing the state of all entities in runtime, and thus is the heaviest component CPU wise. Having been through the most iterations, it is composed of a ton of subcomponents itself.

The director computes things in both background worker threads and the main thread. The main thread is responsible for preparing and dispatching the workers, and the workers compute the heavy operations. Each tick, the main thread rebuilds the spatial grid (packed to a flat array), snapshots every entity's position and velocity into flat arrays, computes their targets, and flattens the shared entity group variables into a struct. This is done to ensure to skip Godot's node structure and to use as much primitive data types as possible, to ensure that the workers do not touch Godot's nodes. The workers then compute the entire next state for a slice of entities: boids, movement, collision, climbing, stuck detection and the final transform. The main thread then waits on them, then handles the parts that cannot be parallelised, like the deletion of entities (handling dead entities).

Other things, like pathfinding, cannot be computed every frame. One of the core optimizations is dividing the world into a flattened array of voxels, which can span millions of voxels effectively reaching MBs of data of pure arrays. (Default limit of 50MB). The entire map is stored in a single flat array of varying voxel types in order to take advantage of locality principles for cache efficiency, and to support multithreaded physics for entities. A side effect of this is that the massive voxel array cannot be iterated over every frame, which means that the pathfinding algorithm has to be spread over multiple frames in a background thread, which actually does not cause much of an issue in terms of pathfinding responsiveness due to **direct targeting**.

The actual implementation is quite lengthy, spanning over five thousand lines across thirty four files, simply due to the amount of data and calculations being performed, and the various optimizations that have been applied over time as I fixed various issues that came up.

## SwarmRenderer (Object)
The SwarmRenderer is responsible for updating the MultiMeshInstance with updated data, as well as rendering debug data like visualizing the flowfields. It is a relatively simple object, as it mostly just reads data computed from the Nexus, which is updated by the director. In order to handle scaling to many thousands of entities, the renderer performs basic optimizations such as utilizing VAT and MultiMeshInstances (one per SwarmGroup).

Instead of a skeleton per entity, the animation is baked into a texture, baking vertex positions and timestamps directly into the texture. A vertex shader then reads it back on the GPU, adding support for per-entity animations using the instance-custom data field. That brings each entity type down to a single draw call through one MultiMeshInstance, while still letting every entity sit at a different point in a different animation.

This depends on an open source OpenVAT addon, and the original did not support Visual Shaders, which meant entities could not have custom materials without giving up their animation or "forking" the shader script. I maintain [a fork](https://github.com/RakkenTi/OpenVAT-for-Godot-Plus) that adds visual shader support for it. A PR has also been merged into the original repository to add the Visual Shader node support.

## SwarmQuery (Object)
As the name implies, this object is all about querying entities in the world space: radius queries returning entity UIDs, bulk lookups, and internal helpers for converting entity UID's to various internal formats. Its uses are shared between both internal modules and for gameplay code, allowing for efficient querying of any number of entities, in a native C++ implementation. This is especially important in GDScript, as there should never be a need to manually iterate through massive entity counts in GDScript for optimization, hence the many exposed helper functions.

## SwarmAtom (Object)
While the SwarmQuery module is responsible for "selecting" or retrieving entities, this module is responsible for acting over the entities, performing specific actions on them, either per entity or on a group of entities. This is specifically a high level API, not used internally, meant for GDScript to use at runtime. This module is responsible for allowing the following actions to happen at runtime: Setting per entity flags like moving and attacking, applying impulses (physics forces), setting target positions (where they are headed), and applying damage to entities.

For each operation, there are a few variants regarding who it is being applied to: a single entity, an array of UIDs, an entire entity group, or everything within a radius. Radial damage supports falloff.

## SwarmPhysics (Object)
Real Godot physics bodies are expensive, so they are rationed. This object maintains a pool of PhysicsServer3D body RIDs and a small set of entities that hold one (Defaults to 100). Physics can be enabled per entity, by UID array, or by radial area. Usually, it will be enabled for entities NEAR physics objects (like players, or movable objects). This allows for true physics simulation without the overhead cost of true physics simulation for thousands of entities. This is a completely separate feature from the collision system, which is based on the voxel grid.

Specfiically, this is separate from the voxel collision system that entities already use (this is another layer). All entities collide with the baked voxel grid, then with each other as boids, then their *dynamic physics* (this module). This module is only for cases where you want genuine rigid body interaction, like an explosion sending a handful of entities flying, or entities moving a ball around, or entities pushing players.

Currently, entities are static bodies, which means that they themselves cannot be pushed and thus they act like immovable objects (infinite force). This can lead to clipping issues, where entities can push objects through surfaces.

## SwarmMonitor (Node)
Mainly a debugging and benchmark tool, SwarmMonitor is responsible for registering custom monitors into Godot for various data points like active and stuck entity counts, flowfield bake times, etc. Used during development to measure/debug regressions and performance issues.

## SwarmGroup (Node)
A SwarmGroup is just an entity type. It is the source of "base stats" for each entity, and holds the constant data for each entity to massively reduce data usage. Instead of storing what an entities base speed is in each entity struct, it can be stored once in the group struct. The SwramGroup node also exposes various entity properties in the editor for easy configuration: max health, speeds for horizontal movement, falling, climbing and strafing, boid parameters like neighbour radius and separation, collision shape, movement type (ground based or flyer), and targeting settings.

Each group owns its own entity array and its own MultiMeshInstance. Registration is automatic if its parent is the SwarmSystemRuntime node, otherwise can be registered manually during runtime by calling a function and passing in the node.

## SwarmLevel (Node3D)
A very important node responsible for making the performance optimizations possible. This node is responsible for baking the entire map into a single flat array in the editor, which is an extremely expensive operation, but results in a very efficient runtime collision system.

Static collision is not baked at runtime, not even during startup. It is instead baked maunally in the editor via a button exposed in the SwarmLevel node, which outputs a resource file with the baked voxel data. The bake processs goes as: read `voxel_size` variable, read the map bounding box (defined by `SwarmBounds`) dimensions, divide the bounding box into voxels, query every voxel for collisions with the map to create a rough hollow case, floodfilling the hollow interiors to fill in gaps, then running multiple passes over the new baked voxels to classify each voxel as floor voxels, climb voxels, or dynamic voxels. Climb voxels get a normal direction computed as a bitmask of which adjacent walls are solid, which is used by the renderer to determine entity orientation. It also generates coarse grids for line of sight calculations and for flying navigation at configurable downsample factors, since those specific operations must be fast in order to ensure entities remain responsive when near targets (otherwise, they'd be going to old positions of their targets).

Every pass is individually toggleable: the climb and floor passes, climb smoothing, climb correction, dangling voxel cleanup, the dynamic pass, and ledge correction. Recommended defaults are assigned, but they remain configurable as some level designs may benefits from certain pass configurations.

## Movement, Pathfinding, Direct Targeting
An entities next position factors in three core things: Stats, Boids, Flowfield, and Direct Targeting state. 

**Stats**: Just an entities speed, acceleration, etc.

**Boids**: A repelling force that pulls and pushes entities from each other, creating the crowded feel instead of just having them overlap each other.

**Flowfield**: A massive array parallel to the baked voxel grid, baked by background threads that basically stores a direction vector instead of collision data at the voxel position of the entity. Entities query this array to determine if they are in a flowfield voxel, and if so will use the flowfield vector direction to pathfind towards a target.

**Direct targeting** handles the issue of flowfield baking being slow and inaccurate when close to the target. Once an entity is within its group's direct targeting range and has line of sight, it stops reading the flowfield entirely and steers straight at the target using live position data.

Line of sight is rechecked on an interval rather than every frame, using the coarse grid rather than the full one as accuracy is not important.

## Multiplayer
Multiplayer is opt in and networking-implementation agnostic. The idea was that I wanted to make it as general as possible, which meant that all the extension does is expose functions that export and import data, and it would be up to each game to implement the networking solution that would transport that data. Godot Swarm packs and unpacks every data format in C++ and hands back PackedByteArray blobs, but leaves the actual transport between clients up to the game. In theory, ENet, WebRTC, Steam, EOS, should work (though I've only tested with ENet and Steam which are my usecases).

## Benchmarks
Each profile runs the same scene with a different agent count, and every number below comes straight out of the benchmark scene. Score is the scene's own weighting of frame time against agent count, so it is only comparable between runs of the same build.

### Desktop
OS: Windows  
CPU: AMD Ryzen 7 5800X, 16 threads  
GPU: AMD Radeon RX 6900 XT  
RAM: 64 GB  
Benchmark score: 20777

| Profile | Agents | Avg FPS | Frame time | 1% low | Max time | Frames | Static mem | Max mem | Draw calls | Primitives | Physics | Score |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| Base | 500 | 1133.55 | 0.882 ms | 3.333 ms | 141.869 ms | 107377 | 981.3 MB | 984.4 MB | 69.5 | 197543 | 14 | 8761.5 |
| Light | 4991 | 591.45 | 1.691 ms | 5.430 ms | 18.901 ms | 56165 | 983.9 MB | 987.5 MB | 71.4 | 200822 | 16 | 4802.9 |
| Normal | 9941 | 356.63 | 2.804 ms | 8.670 ms | 21.371 ms | 33861 | 985.3 MB | 989.2 MB | 72.0 | 194488 | 14 | 3165.8 |
| Heavy | 22168 | 176.98 | 5.650 ms | 16.021 ms | 35.860 ms | 16801 | 989.0 MB | 991.5 MB | 71.1 | 192883 | 13 | 2125.9 |
| Extreme | 48519 | 62.01 | 16.127 ms | 62.093 ms | 148.864 ms | 5881 | 997.4 MB | 999.1 MB | 72.1 | 191424 | 11 | 1920.4 |
| **Average** | 17224 | 184.14 | 5.431 ms | 19.110 ms | 148.864 ms | 44017 | 987.4 MB | 990.3 MB | 71.2 | 195432 | 14 | 4155.3 |

### Laptop
OS: Linux  
CPU: AMD Ryzen 7 PRO 7840U, 16 threads  
GPU: AMD Radeon 780M  
RAM: 32 GB  
Benchmark score: 6788

| Profile | Agents | Avg FPS | Frame time | 1% low | Max time | Frames | Static mem | Max mem | Draw calls | Primitives | Physics | Score |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| Base | 500 | 323.10 | 13.696 ms | 112.282 ms | 112.282 ms | 28730 | 993.8 MB | 999.0 MB | 68.7 | 203398 | 17 | 1848.3 |
| Light | 4998 | 146.16 | 13.267 ms | 41.008 ms | 46.790 ms | 13105 | 995.8 MB | 1001.0 MB | 72.3 | 208269 | 21 | 1222.9 |
| Normal | 10000 | 90.73 | 19.057 ms | 47.318 ms | 48.897 ms | 7997 | 997.4 MB | 1001.5 MB | 75.9 | 212900 | 25 | 1033.1 |
| Heavy | 22497 | 46.43 | 32.303 ms | 59.896 ms | 65.837 ms | 3929 | 1001.2 MB | 1004.1 MB | 74.6 | 210429 | 24 | 1091.9 |
| Extreme | 49994 | 16.38 | 94.177 ms | 181.847 ms | 181.847 ms | 1264 | 1009.7 MB | 1012.1 MB | 73.5 | 194815 | 18 | 1591.7 |
| **Average** | 17598 | 124.56 | 34.500 ms | 88.470 ms | 36.369 ms | 11005 | 999.6 MB | 1003.5 MB | 73.0 | 205962 | 21 | 1357.6 |

The important profiles are Base and Light, which represent the average and high-end entity counts for most production games. The rest of the profiles from Normal to Extreme are solely for benchmarking, and does not represent the amount of entities that would be present in most games.

## Open Source
I'd like to eventually make this GDExtension open source, but only after it has been thoroughly tested and implemented in a production game, which I hope to do so by 2027. Once that has been achieved, the repository will be made public and documentation will be made so that hopefully other developers can find use for it in their games.
