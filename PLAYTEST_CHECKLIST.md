# HarvestTown Playtest Checklist ✅

## Core Movement Testing

### Basic Controls
- [ ] **WASD keys** move player in all 4 directions
- [ ] **Arrow keys** move player in all 4 directions  
- [ ] **Diagonal movement** works and is normalized (not faster)
- [ ] **Player stops** smoothly when keys are released
- [ ] **Movement feels responsive** (reaches max speed in ~0.8 seconds)

### Advanced Movement
- [ ] **Gamepad support** works (if gamepad connected)
- [ ] **Movement animations** play correctly (walk/idle)
- [ ] **Direction changes** are smooth without stuttering
- [ ] **Player shadow** follows and bobs when walking
- [ ] **Collision detection** works with world boundaries

## Camera System

### Following Behavior
- [ ] **Camera follows player** smoothly
- [ ] **Lookahead** works (camera moves ahead of player direction)
- [ ] **Camera stays within map bounds** at edges
- [ ] **No camera jitter** during movement
- [ ] **Zoom levels** work (keys 1, 2, 3)

### Camera Effects
- [ ] **Camera shake** works (X key)
- [ ] **Smooth transitions** between zoom levels
- [ ] **Camera centers** properly on player

## Interaction System

### Input Response
- [ ] **E key** triggers interact action
- [ ] **Space key** triggers interact action
- [ ] **Right click** triggers tool use action
- [ ] **Input buffering** works (actions don't get lost)
- [ ] **Action cooldown** prevents spam clicking

### Visual Feedback
- [ ] **Green circle** appears on interact
- [ ] **Orange circle** appears on tool use
- [ ] **Feedback appears** at correct tile location
- [ ] **Animations play** smoothly

## Performance Testing

### Frame Rate
- [ ] **60 FPS** maintained during normal gameplay
- [ ] **No frame drops** during movement
- [ ] **Smooth animations** without stuttering
- [ ] **Quick load time** (under 3 seconds)

### Debug Information
- [ ] **F3 key** toggles debug overlay
- [ ] **FPS counter** shows accurate information
- [ ] **Player position** updates in real-time
- [ ] **Velocity information** is accurate

## User Interface

### Loading Screen
- [ ] **Progress bar** shows loading progress
- [ ] **Loading text** updates with current asset
- [ ] **Smooth transition** to game after loading
- [ ] **No loading errors** in console

### Game UI
- [ ] **Debug overlay** is readable and informative
- [ ] **UI scales** properly on different screen sizes
- [ ] **Text is crisp** and easy to read

## Browser Compatibility

### Desktop Browsers
- [ ] **Chrome** - Full functionality
- [ ] **Firefox** - Full functionality  
- [ ] **Edge** - Full functionality
- [ ] **Safari** - Full functionality

### Mobile Browsers (if applicable)
- [ ] **Mobile Chrome** - Loads and runs
- [ ] **Mobile Safari** - Loads and runs
- [ ] **Touch controls** work (if implemented)

## Asset Loading

### Graphics
- [ ] **Player sprites** load correctly
- [ ] **Tileset** displays properly
- [ ] **All animations** play without errors
- [ ] **No missing textures** or broken images

### Audio (when implemented)
- [ ] **Sound effects** play at correct times
- [ ] **Background music** loops properly
- [ ] **Audio volume** is appropriate

## Edge Cases

### Boundary Testing
- [ ] **Player can't move** outside map boundaries
- [ ] **Camera behavior** is correct at map edges
- [ ] **No visual glitches** at boundaries

### Input Edge Cases
- [ ] **Multiple keys pressed** simultaneously work
- [ ] **Rapid key presses** don't break movement
- [ ] **Alt-tab** and return doesn't break game
- [ ] **Window resize** doesn't break layout

## Bug Reporting Template

When you find issues, report them with:

```
**Bug Title**: Brief description

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Result**: What should happen
**Actual Result**: What actually happens
**Browser**: Chrome/Firefox/etc.
**Console Errors**: Any error messages
**Screenshot**: If visual issue
```

## Performance Benchmarks

### Target Specifications
- **Minimum**: Intel i5 integrated graphics, 4GB RAM
- **Target FPS**: 60 FPS sustained
- **Load Time**: Under 3 seconds on broadband
- **Bundle Size**: Under 10MB total

### Performance Issues to Watch For
- [ ] Frame rate drops below 55 FPS
- [ ] Memory usage increases over time
- [ ] Loading takes longer than 5 seconds
- [ ] Audio/visual sync issues

## Accessibility Testing

### Basic Accessibility
- [ ] **Keyboard navigation** works completely
- [ ] **High contrast** mode doesn't break visuals
- [ ] **Text is readable** at default browser zoom
- [ ] **Color blind friendly** (no red/green only indicators)

## Final Checklist

Before declaring a build "ready":
- [ ] All core movement tests pass
- [ ] No console errors during normal play
- [ ] Performance meets target specifications
- [ ] Works in at least 3 different browsers
- [ ] Loading and transitions are smooth
- [ ] No game-breaking bugs found

---

**Happy Testing! 🎮**

*Remember: The goal is to find issues early so players have the best experience possible.*