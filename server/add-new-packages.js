const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// New packages to add from shortcuts.design
const newPackages = [
  {
    name: "PixelCraft Pro",
    description: "Professional image editing and digital art creation with advanced tools and effects",
    author_name: "CreativeFlow",
    category: "Design",
    image_url: "/images/photoshop.png",
    shortcuts: JSON.stringify([
      { key: "Ctrl+N", description: "New document" },
      { key: "Ctrl+O", description: "Open file" },
      { key: "Ctrl+S", description: "Save" },
      { key: "Ctrl+Shift+S", description: "Save As" },
      { key: "Ctrl+Z", description: "Undo" },
      { key: "Ctrl+Shift+Z", description: "Redo" },
      { key: "Ctrl+A", description: "Select All" },
      { key: "Ctrl+D", description: "Deselect" },
      { key: "Ctrl+T", description: "Free Transform" },
      { key: "Ctrl+J", description: "Duplicate Layer" },
      { key: "Ctrl+Shift+N", description: "New Layer" },
      { key: "Delete", description: "Delete Layer" },
      { key: "Ctrl+E", description: "Merge Layers" },
      { key: "Ctrl+Shift+E", description: "Merge Visible" },
      { key: "Ctrl+G", description: "Group Layers" },
      { key: "Ctrl+Shift+G", description: "Ungroup Layers" },
      { key: "Ctrl+R", description: "Show/Hide Rulers" },
      { key: "Ctrl+;", description: "Show/Hide Guides" },
      { key: "Ctrl+Alt+;", description: "Lock Guides" },
      { key: "Ctrl+Shift+;", description: "Snap to Guides" },
      { key: "Ctrl+Alt+G", description: "Create Clipping Mask" },
      { key: "Ctrl+Shift+Alt+G", description: "Release Clipping Mask" },
      { key: "Ctrl+Shift+U", description: "Desaturate" },
      { key: "Ctrl+U", description: "Hue/Saturation" },
      { key: "Ctrl+L", description: "Levels" },
      { key: "Ctrl+M", description: "Curves" },
      { key: "Ctrl+B", description: "Color Balance" },
      { key: "Ctrl+Shift+B", description: "Auto Color" },
      { key: "Ctrl+Shift+L", description: "Auto Levels" },
      { key: "Ctrl+Shift+Alt+L", description: "Auto Contrast" },
      { key: "Ctrl+I", description: "Invert" },
      { key: "Ctrl+Shift+I", description: "Invert Selection" },
      { key: "Ctrl+Alt+A", description: "Select All Layers" },
      { key: "Ctrl+Alt+Shift+A", description: "Deselect All Layers" }
    ])
  },
  {
    name: "LayoutMaster Studio",
    description: "Professional page layout and publishing for print and digital media",
    author_name: "DesignNinja",
    category: "Design",
    image_url: "/images/indesign.png",
    shortcuts: JSON.stringify([
      { key: "Ctrl+N", description: "New document" },
      { key: "Ctrl+O", description: "Open file" },
      { key: "Ctrl+S", description: "Save" },
      { key: "Ctrl+Shift+S", description: "Save As" },
      { key: "Ctrl+Z", description: "Undo" },
      { key: "Ctrl+Shift+Z", description: "Redo" },
      { key: "Ctrl+A", description: "Select All" },
      { key: "Ctrl+D", description: "Deselect" },
      { key: "Ctrl+C", description: "Copy" },
      { key: "Ctrl+V", description: "Paste" },
      { key: "Ctrl+X", description: "Cut" },
      { key: "Ctrl+Shift+V", description: "Paste in Place" },
      { key: "Ctrl+Alt+V", description: "Paste without Formatting" },
      { key: "Ctrl+Shift+C", description: "Copy with Formatting" },
      { key: "Ctrl+Shift+X", description: "Cut with Formatting" },
      { key: "Ctrl+G", description: "Group" },
      { key: "Ctrl+Shift+G", description: "Ungroup" },
      { key: "Ctrl+L", description: "Lock" },
      { key: "Ctrl+Alt+L", description: "Unlock All" },
      { key: "Ctrl+Shift+L", description: "Lock Others" },
      { key: "Ctrl+Alt+Shift+L", description: "Unlock All on Spread" },
      { key: "Ctrl+Shift+[", description: "Send to Back" },
      { key: "Ctrl+Shift+]", description: "Bring to Front" },
      { key: "Ctrl+[", description: "Send Backward" },
      { key: "Ctrl+]", description: "Bring Forward" },
      { key: "Ctrl+Alt+Shift+[", description: "Send to Back of Layer" },
      { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of Layer" },
      { key: "Ctrl+Alt+[", description: "Send Backward in Layer" },
      { key: "Ctrl+Alt+]", description: "Bring Forward in Layer" },
      { key: "Ctrl+Shift+O", description: "Create Outlines" },
      { key: "Ctrl+Shift+F", description: "Find/Change" },
      { key: "Ctrl+Alt+Shift+F", description: "Find/Change in Story" },
      { key: "Ctrl+Shift+K", description: "Check Spelling" },
      { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in Story" },
      { key: "Ctrl+Shift+E", description: "Edit Original" },
      { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
      { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
    ])
  },
  {
    name: "UX Prototype Pro",
    description: "Interactive prototyping and user experience design for modern applications",
    author_name: "CreativeFlow",
    category: "Design",
    image_url: "/images/xd.png",
    shortcuts: JSON.stringify([
      { key: "Ctrl+N", description: "New document" },
      { key: "Ctrl+O", description: "Open file" },
      { key: "Ctrl+S", description: "Save" },
      { key: "Ctrl+Shift+S", description: "Save As" },
      { key: "Ctrl+Z", description: "Undo" },
      { key: "Ctrl+Shift+Z", description: "Redo" },
      { key: "Ctrl+A", description: "Select All" },
      { key: "Ctrl+D", description: "Deselect" },
      { key: "Ctrl+C", description: "Copy" },
      { key: "Ctrl+V", description: "Paste" },
      { key: "Ctrl+X", description: "Cut" },
      { key: "Ctrl+Shift+V", description: "Paste in Place" },
      { key: "Ctrl+Alt+V", description: "Paste without Formatting" },
      { key: "Ctrl+Shift+C", description: "Copy with Formatting" },
      { key: "Ctrl+Shift+X", description: "Cut with Formatting" },
      { key: "Ctrl+G", description: "Group" },
      { key: "Ctrl+Shift+G", description: "Ungroup" },
      { key: "Ctrl+L", description: "Lock" },
      { key: "Ctrl+Alt+L", description: "Unlock All" },
      { key: "Ctrl+Shift+L", description: "Lock Others" },
      { key: "Ctrl+Alt+Shift+L", description: "Unlock All on Artboard" },
      { key: "Ctrl+Shift+[", description: "Send to Back" },
      { key: "Ctrl+Shift+]", description: "Bring to Front" },
      { key: "Ctrl+[", description: "Send Backward" },
      { key: "Ctrl+]", description: "Bring Forward" },
      { key: "Ctrl+Alt+Shift+[", description: "Send to Back of Layer" },
      { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of Layer" },
      { key: "Ctrl+Alt+[", description: "Send Backward in Layer" },
      { key: "Ctrl+Alt+]", description: "Bring Forward in Layer" },
      { key: "Ctrl+Shift+O", description: "Create Outlines" },
      { key: "Ctrl+Shift+F", description: "Find/Change" },
      { key: "Ctrl+Alt+Shift+F", description: "Find/Change in Story" },
      { key: "Ctrl+Shift+K", description: "Check Spelling" },
      { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in Story" },
      { key: "Ctrl+Shift+E", description: "Edit Original" },
      { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
      { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
    ])
  },
  {
    name: "MotionFX Studio",
    description: "Advanced motion graphics and visual effects for video production",
    author_name: "DigitalArtist",
    category: "Design",
    image_url: "/images/aftereffects.png",
    shortcuts: JSON.stringify([
      { key: "Ctrl+N", description: "New composition" },
      { key: "Ctrl+O", description: "Open project" },
      { key: "Ctrl+S", description: "Save" },
      { key: "Ctrl+Shift+S", description: "Save As" },
      { key: "Ctrl+Z", description: "Undo" },
      { key: "Ctrl+Shift+Z", description: "Redo" },
      { key: "Ctrl+A", description: "Select All" },
      { key: "Ctrl+D", description: "Deselect" },
      { key: "Ctrl+C", description: "Copy" },
      { key: "Ctrl+V", description: "Paste" },
      { key: "Ctrl+X", description: "Cut" },
      { key: "Ctrl+Shift+V", description: "Paste in Place" },
      { key: "Ctrl+Alt+V", description: "Paste without Formatting" },
      { key: "Ctrl+Shift+C", description: "Copy with Formatting" },
      { key: "Ctrl+Shift+X", description: "Cut with Formatting" },
      { key: "Ctrl+G", description: "Group" },
      { key: "Ctrl+Shift+G", description: "Ungroup" },
      { key: "Ctrl+L", description: "Lock" },
      { key: "Ctrl+Alt+L", description: "Unlock All" },
      { key: "Ctrl+Shift+L", description: "Lock Others" },
      { key: "Ctrl+Alt+Shift+L", description: "Unlock All on Layer" },
      { key: "Ctrl+Shift+[", description: "Send to Back" },
      { key: "Ctrl+Shift+]", description: "Bring to Front" },
      { key: "Ctrl+[", description: "Send Backward" },
      { key: "Ctrl+]", description: "Bring Forward" },
      { key: "Ctrl+Alt+Shift+[", description: "Send to Back of Layer" },
      { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of Layer" },
      { key: "Ctrl+Alt+[", description: "Send Backward in Layer" },
      { key: "Ctrl+Alt+]", description: "Bring Forward in Layer" },
      { key: "Ctrl+Shift+O", description: "Create Outlines" },
      { key: "Ctrl+Shift+F", description: "Find/Change" },
      { key: "Ctrl+Alt+Shift+F", description: "Find/Change in Story" },
      { key: "Ctrl+Shift+K", description: "Check Spelling" },
      { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in Story" },
      { key: "Ctrl+Shift+E", description: "Edit Original" },
      { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
      { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
    ])
  },
  {
    name: "KnowledgeBase Hub",
    description: "All-in-one workspace for notes, docs, and team collaboration",
    author_name: "ProductivityPro",
    category: "Productivity",
    image_url: "/images/notion.png",
    shortcuts: JSON.stringify([
      { key: "Ctrl+N", description: "New page" },
      { key: "Ctrl+O", description: "Open page" },
      { key: "Ctrl+S", description: "Save" },
      { key: "Ctrl+Shift+S", description: "Save As" },
      { key: "Ctrl+Z", description: "Undo" },
      { key: "Ctrl+Shift+Z", description: "Redo" },
      { key: "Ctrl+A", description: "Select All" },
      { key: "Ctrl+D", description: "Deselect" },
      { key: "Ctrl+C", description: "Copy" },
      { key: "Ctrl+V", description: "Paste" },
      { key: "Ctrl+X", description: "Cut" },
      { key: "Ctrl+Shift+V", description: "Paste in Place" },
      { key: "Ctrl+Alt+V", description: "Paste without Formatting" },
      { key: "Ctrl+Shift+C", description: "Copy with Formatting" },
      { key: "Ctrl+Shift+X", description: "Cut with Formatting" },
      { key: "Ctrl+G", description: "Group" },
      { key: "Ctrl+Shift+G", description: "Ungroup" },
      { key: "Ctrl+L", description: "Lock" },
      { key: "Ctrl+Alt+L", description: "Unlock All" },
      { key: "Ctrl+Shift+L", description: "Lock Others" },
      { key: "Ctrl+Alt+Shift+L", description: "Unlock All on Page" },
      { key: "Ctrl+Shift+[", description: "Send to Back" },
      { key: "Ctrl+Shift+]", description: "Bring to Front" },
      { key: "Ctrl+[", description: "Send Backward" },
      { key: "Ctrl+]", description: "Bring Forward" },
      { key: "Ctrl+Alt+Shift+[", description: "Send to Back of Block" },
      { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of Block" },
      { key: "Ctrl+Alt+[", description: "Send Backward in Block" },
      { key: "Ctrl+Alt+]", description: "Bring Forward in Block" },
      { key: "Ctrl+Shift+O", description: "Create Outlines" },
      { key: "Ctrl+Shift+F", description: "Find/Change" },
      { key: "Ctrl+Alt+Shift+F", description: "Find/Change in Page" },
      { key: "Ctrl+Shift+K", description: "Check Spelling" },
      { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in Page" },
      { key: "Ctrl+Shift+E", description: "Edit Original" },
      { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
      { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
    ])
  },
  {
    name: "TaskFlow Manager",
    description: "Modern project management and team collaboration platform",
    author_name: "ProductivityPro",
    category: "Productivity",
    image_url: "/images/linear.png",
    shortcuts: JSON.stringify([
      { key: "Ctrl+N", description: "New issue" },
      { key: "Ctrl+O", description: "Open issue" },
      { key: "Ctrl+S", description: "Save" },
      { key: "Ctrl+Shift+S", description: "Save As" },
      { key: "Ctrl+Z", description: "Undo" },
      { key: "Ctrl+Shift+Z", description: "Redo" },
      { key: "Ctrl+A", description: "Select All" },
      { key: "Ctrl+D", description: "Deselect" },
      { key: "Ctrl+C", description: "Copy" },
      { key: "Ctrl+V", description: "Paste" },
      { key: "Ctrl+X", description: "Cut" },
      { key: "Ctrl+Shift+V", description: "Paste in Place" },
      { key: "Ctrl+Alt+V", description: "Paste without Formatting" },
      { key: "Ctrl+Shift+C", description: "Copy with Formatting" },
      { key: "Ctrl+Shift+X", description: "Cut with Formatting" },
      { key: "Ctrl+G", description: "Group" },
      { key: "Ctrl+Shift+G", description: "Ungroup" },
      { key: "Ctrl+L", description: "Lock" },
      { key: "Ctrl+Alt+L", description: "Unlock All" },
      { key: "Ctrl+Shift+L", description: "Lock Others" },
      { key: "Ctrl+Alt+Shift+L", description: "Unlock All on Project" },
      { key: "Ctrl+Shift+[", description: "Send to Back" },
      { key: "Ctrl+Shift+]", description: "Bring to Front" },
      { key: "Ctrl+[", description: "Send Backward" },
      { key: "Ctrl+]", description: "Bring Forward" },
      { key: "Ctrl+Alt+Shift+[", description: "Send to Back of Sprint" },
      { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of Sprint" },
      { key: "Ctrl+Alt+[", description: "Send Backward in Sprint" },
      { key: "Ctrl+Alt+]", description: "Bring Forward in Sprint" },
      { key: "Ctrl+Shift+O", description: "Create Outlines" },
      { key: "Ctrl+Shift+F", description: "Find/Change" },
      { key: "Ctrl+Alt+Shift+F", description: "Find/Change in Project" },
      { key: "Ctrl+Shift+K", description: "Check Spelling" },
      { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in Project" },
      { key: "Ctrl+Shift+E", description: "Edit Original" },
      { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
      { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
    ])
  },
  {
    name: "CodeCraft Editor",
    description: "Fast and powerful text editor for code and markup",
    author_name: "ByteMaster",
    category: "Development",
    image_url: "/images/sublime.png",
    shortcuts: JSON.stringify([
      { key: "Ctrl+N", description: "New file" },
      { key: "Ctrl+O", description: "Open file" },
      { key: "Ctrl+S", description: "Save" },
      { key: "Ctrl+Shift+S", description: "Save As" },
      { key: "Ctrl+Z", description: "Undo" },
      { key: "Ctrl+Shift+Z", description: "Redo" },
      { key: "Ctrl+A", description: "Select All" },
      { key: "Ctrl+D", description: "Deselect" },
      { key: "Ctrl+C", description: "Copy" },
      { key: "Ctrl+V", description: "Paste" },
      { key: "Ctrl+X", description: "Cut" },
      { key: "Ctrl+Shift+V", description: "Paste in Place" },
      { key: "Ctrl+Alt+V", description: "Paste without Formatting" },
      { key: "Ctrl+Shift+C", description: "Copy with Formatting" },
      { key: "Ctrl+Shift+X", description: "Cut with Formatting" },
      { key: "Ctrl+G", description: "Go to Line" },
      { key: "Ctrl+Shift+G", description: "Go to Symbol" },
      { key: "Ctrl+L", description: "Select Line" },
      { key: "Ctrl+Alt+L", description: "Select All Lines" },
      { key: "Ctrl+Shift+L", description: "Split Selection into Lines" },
      { key: "Ctrl+Alt+Shift+L", description: "Split Selection into Words" },
      { key: "Ctrl+Shift+[", description: "Fold" },
      { key: "Ctrl+Shift+]", description: "Unfold" },
      { key: "Ctrl+[", description: "Fold All" },
      { key: "Ctrl+]", description: "Unfold All" },
      { key: "Ctrl+Alt+Shift+[", description: "Fold Level 1" },
      { key: "Ctrl+Alt+Shift+]", description: "Unfold Level 1" },
      { key: "Ctrl+Alt+[", description: "Fold Level 2" },
      { key: "Ctrl+Alt+]", description: "Unfold Level 2" },
      { key: "Ctrl+Shift+O", description: "Create Outlines" },
      { key: "Ctrl+Shift+F", description: "Find/Change" },
      { key: "Ctrl+Alt+Shift+F", description: "Find/Change in Files" },
      { key: "Ctrl+Shift+K", description: "Check Spelling" },
      { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in Files" },
      { key: "Ctrl+Shift+E", description: "Edit Original" },
      { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
      { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
    ])
  },
  {
    name: "iOS Dev Studio",
    description: "Complete development environment for iOS, macOS, and watchOS applications",
    author_name: "ByteMaster",
    category: "Development",
    image_url: "/images/xcode.png",
    shortcuts: JSON.stringify([
      { key: "Cmd+N", description: "New file" },
      { key: "Cmd+O", description: "Open file" },
      { key: "Cmd+S", description: "Save" },
      { key: "Cmd+Shift+S", description: "Save As" },
      { key: "Cmd+Z", description: "Undo" },
      { key: "Cmd+Shift+Z", description: "Redo" },
      { key: "Cmd+A", description: "Select All" },
      { key: "Cmd+D", description: "Deselect" },
      { key: "Cmd+C", description: "Copy" },
      { key: "Cmd+V", description: "Paste" },
      { key: "Cmd+X", description: "Cut" },
      { key: "Cmd+Shift+V", description: "Paste in Place" },
      { key: "Cmd+Alt+V", description: "Paste without Formatting" },
      { key: "Cmd+Shift+C", description: "Copy with Formatting" },
      { key: "Cmd+Shift+X", description: "Cut with Formatting" },
      { key: "Cmd+G", description: "Go to Line" },
      { key: "Cmd+Shift+G", description: "Go to Symbol" },
      { key: "Cmd+L", description: "Select Line" },
      { key: "Cmd+Alt+L", description: "Select All Lines" },
      { key: "Cmd+Shift+L", description: "Split Selection into Lines" },
      { key: "Cmd+Alt+Shift+L", description: "Split Selection into Words" },
      { key: "Cmd+Shift+[", description: "Fold" },
      { key: "Cmd+Shift+]", description: "Unfold" },
      { key: "Cmd+[", description: "Fold All" },
      { key: "Cmd+]", description: "Unfold All" },
      { key: "Cmd+Alt+Shift+[", description: "Fold Level 1" },
      { key: "Cmd+Alt+Shift+]", description: "Unfold Level 1" },
      { key: "Cmd+Alt+[", description: "Fold Level 2" },
      { key: "Cmd+Alt+]", description: "Unfold Level 2" },
      { key: "Cmd+Shift+O", description: "Create Outlines" },
      { key: "Cmd+Shift+F", description: "Find/Change" },
      { key: "Cmd+Alt+Shift+F", description: "Find/Change in Files" },
      { key: "Cmd+Shift+K", description: "Check Spelling" },
      { key: "Cmd+Alt+Shift+K", description: "Check Spelling in Files" },
      { key: "Cmd+Shift+E", description: "Edit Original" },
      { key: "Cmd+Alt+Shift+E", description: "Edit Original in Place" },
      { key: "Cmd+Shift+Alt+E", description: "Edit Original in New Window" }
    ])
  },
  {
    name: "3D Model Forge",
    description: "Professional 3D modeling, animation, and rendering software",
    author_name: "DigitalArtist",
    category: "3D",
    image_url: "/images/blender.png",
    shortcuts: JSON.stringify([
      { key: "Ctrl+N", description: "New file" },
      { key: "Ctrl+O", description: "Open file" },
      { key: "Ctrl+S", description: "Save" },
      { key: "Ctrl+Shift+S", description: "Save As" },
      { key: "Ctrl+Z", description: "Undo" },
      { key: "Ctrl+Shift+Z", description: "Redo" },
      { key: "Ctrl+A", description: "Select All" },
      { key: "Ctrl+D", description: "Deselect" },
      { key: "Ctrl+C", description: "Copy" },
      { key: "Ctrl+V", description: "Paste" },
      { key: "Ctrl+X", description: "Cut" },
      { key: "Ctrl+Shift+V", description: "Paste in Place" },
      { key: "Ctrl+Alt+V", description: "Paste without Formatting" },
      { key: "Ctrl+Shift+C", description: "Copy with Formatting" },
      { key: "Ctrl+Shift+X", description: "Cut with Formatting" },
      { key: "Ctrl+G", description: "Group" },
      { key: "Ctrl+Shift+G", description: "Ungroup" },
      { key: "Ctrl+L", description: "Link" },
      { key: "Ctrl+Alt+L", description: "Unlink" },
      { key: "Ctrl+Shift+L", description: "Link to Collection" },
      { key: "Ctrl+Alt+Shift+L", description: "Unlink from Collection" },
      { key: "Ctrl+Shift+[", description: "Send to Back" },
      { key: "Ctrl+Shift+]", description: "Bring to Front" },
      { key: "Ctrl+[", description: "Send Backward" },
      { key: "Ctrl+]", description: "Bring Forward" },
      { key: "Ctrl+Alt+Shift+[", description: "Send to Back of Layer" },
      { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of Layer" },
      { key: "Ctrl+Alt+[", description: "Send Backward in Layer" },
      { key: "Ctrl+Alt+]", description: "Bring Forward in Layer" },
      { key: "Ctrl+Shift+O", description: "Create Outlines" },
      { key: "Ctrl+Shift+F", description: "Find/Change" },
      { key: "Ctrl+Alt+Shift+F", description: "Find/Change in Scene" },
      { key: "Ctrl+Shift+K", description: "Check Spelling" },
      { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in Scene" },
      { key: "Ctrl+Shift+E", description: "Edit Original" },
      { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
      { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
    ])
  }
];

function addNewPackages() {
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite');
  const db = new sqlite3.Database(dbPath);

  console.log('Adding new packages from shortcuts.design...');

  // First, get the sample user ID
  db.get('SELECT id FROM users WHERE google_id = ?', ['sample_user_1'], (err, user) => {
    if (err) {
      console.error('Error getting sample user:', err.message);
      return;
    }

    if (!user) {
      console.log('Sample user not found, creating...');
      db.run('INSERT INTO users (google_id, username, email, avatar_url) VALUES (?, ?, ?, ?)',
        ['sample_user_1', 'KeyWizard Community', 'community@keywizard.com', null],
        function(err) {
          if (err) {
            console.error('Error creating sample user:', err.message);
            return;
          }
          console.log('Sample user created with ID:', this.lastID);
          insertPackages(this.lastID);
        });
    } else {
      console.log('Using existing sample user with ID:', user.id);
      insertPackages(user.id);
    }
  });

  function insertPackages(userId) {
    let addedCount = 0;
    let skippedCount = 0;

    newPackages.forEach((pkg, index) => {
      // Check if package already exists
      db.get('SELECT id FROM shortcut_packages WHERE name = ?', [pkg.name], (err, existing) => {
        if (err) {
          console.error(`Error checking package ${pkg.name}:`, err.message);
          return;
        }

        if (existing) {
          console.log(`Package "${pkg.name}" already exists, skipping...`);
          skippedCount++;
        } else {
          // Insert new package
          db.run(
            'INSERT INTO shortcut_packages (name, description, author_name, category, image_url, shortcuts, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
            [pkg.name, pkg.description, pkg.author_name, pkg.category, pkg.image_url, pkg.shortcuts, userId],
            function(err) {
              if (err) {
                console.error(`Error inserting package ${pkg.name}:`, err.message);
                return;
              }
              console.log(`✅ Added package "${pkg.name}" with ID: ${this.lastID}`);
              addedCount++;
            }
          );
        }

        // Check if this is the last package
        if (index === newPackages.length - 1) {
          setTimeout(() => {
            console.log(`\n🎉 Migration complete! Added ${addedCount} packages, skipped ${skippedCount} existing packages.`);
            db.close();
          }, 1000);
        }
      });
    });
  }
}

// Run the migration
addNewPackages(); 