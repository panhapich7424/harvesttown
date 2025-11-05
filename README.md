# HarvestTown 🌾

A Stardew Valley-inspired farming RPG built for the web using TypeScript and Phaser 3.

## Features

- **Smooth Player Movement**: Responsive WASD/arrow key controls with gamepad support
- **Polished Controls**: Diagonal movement normalization, acceleration/deceleration, input buffering
- **Modular Architecture**: Clean separation of systems (Player, Camera, Animation, etc.)
- **Performance Optimized**: 60 FPS target with efficient rendering
- **Web-Ready**: Single HTML file deployment, runs in modern browsers

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

The game will open automatically at `http://localhost:3000`

## Controls

### Keyboard
- **WASD** or **Arrow Keys**: Move player
- **E** or **Space**: Interact with objects/NPCs
- **Right Click**: Use equipped tool
- **F3**: Toggle debug overlay
- **1/2/3**: Camera zoom levels
- **X**: Test camera shake

### Gamepad
- **Left Stick**: Move player
- **A Button**: Interact
- **X Button**: Use tool

### Touch (Mobile)
- Virtual joystick and action buttons (planned)

## Project Structure

```
src/
├── bootstrap.ts           # Game initialization
├── scenes/
│   ├── PreloadScene.ts   # Asset loading with progress bar
│   └── GameScene.ts      # Main gameplay scene
├── systems/
│   ├── PlayerController.ts    # Player movement and input
│   ├── AnimationManager.ts    # Animation creation and management
│   ├── CameraSystem.ts        # Smooth camera following
│   ├── FarmingSystem.ts       # Crop planting and growth (planned)
│   ├── InventorySystem.ts     # Item management (planned)
│   ├── NPCSystem.ts           # NPC behavior and schedules (planned)
│   └── SaveSystem.ts          # Game state persistence (planned)
├── utils/
│   ├── Vector2.ts        # 2D vector math utilities
│   └── MathUtils.ts      # Game math helpers
└── __tests__/            # Unit tests
```

## Movement System

The player movement system implements the specified physics:

- **Max Speed**: 140 pixels/second
- **Acceleration**: 1200 px/s²
- **Deceleration**: 1500 px/s²
- **Input Deadzone**: 0.12 (gamepad)
- **Smoothing**: Velocity lerp with factor 12

### Movement Features
- Diagonal movement normalization (no speed advantage)
- Smooth acceleration/deceleration curves
- Input buffering (120ms) for responsive actions
- Action cooldown (250ms) to prevent spam
- 8-direction movement with 4-direction animations

## Camera System

- **Smooth Following**: Lerp factor 0.08 for cinematic feel
- **Lookahead**: 32px lookahead based on player velocity
- **Deadzone**: Configurable camera deadzone for comfortable following
- **Bounds Clamping**: Camera stays within map boundaries
- **Effects**: Shake, flash, fade, and zoom capabilities

## Asset Management

Assets are loaded via `assets/manifest.json`:

```json
{
  "spritesheets": {
    "player_idle": {
      "key": "player_idle",
      "path": "assets/Character/Idle.png",
      "frameWidth": 32,
      "frameHeight": 32
    }
  }
}
```

## Development

### Adding New Systems

1. Create system class in `src/systems/`
2. Import and initialize in `GameScene.ts`
3. Add event listeners if needed
4. Write unit tests in `__tests__/`

### Asset Integration

1. Add assets to appropriate `assets/` subfolder
2. Update `assets/manifest.json` with asset metadata
3. Load in `PreloadScene.ts`
4. Create animations in `AnimationManager.ts`

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test Vector2.test.ts
```

## Deployment

### Build Production Bundle

```bash
npm run build
```

This creates a `dist/` folder with:
- `index.html` - Main game file
- `assets/` - Optimized game assets
- `bundle.js` - Minified game code

### Hosting Options

#### Netlify (Recommended)
1. Drag `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get instant live URL

#### Static File Hosting
Upload `dist/` contents to any static host:
- GitHub Pages
- Vercel
- Render Static Sites
- AWS S3 + CloudFront

#### Local Testing
```bash
npm run preview
```

## Performance

### Target Specifications
- **60 FPS** on mid-range hardware
- **Intel i5 integrated GPU** compatibility
- **10+ active NPCs** without frame drops

### Optimization Features
- Sprite atlasing for reduced draw calls
- Object pooling for dynamic entities
- Configurable quality settings
- Lazy loading for large maps
- WebGL rendering with Phaser 3

## Debug Tools

Press **F3** in-game to toggle debug overlay showing:
- FPS counter
- Player position and velocity
- Camera information
- Control hints

## Roadmap

### Core Systems (In Progress)
- [x] Player movement and controls
- [x] Camera system
- [x] Animation management
- [ ] Farming system (tilling, planting, harvesting)
- [ ] Inventory and crafting
- [ ] NPC schedules and dialogue
- [ ] Day/night cycle
- [ ] Save/load system

### Advanced Features (Planned)
- [ ] Quest system
- [ ] Relationship mechanics
- [ ] Seasonal changes
- [ ] Audio system
- [ ] Mobile touch controls
- [ ] Multiplayer support

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Credits

- Built with [Phaser 3](https://phaser.io/)
- Inspired by [Stardew Valley](https://stardewvalley.net/)
- Asset pack: [Your Asset Pack Name]

---

**Happy Farming! 🚜**