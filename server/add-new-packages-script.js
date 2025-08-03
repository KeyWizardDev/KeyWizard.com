const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function addNewPackages() {
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite');
  const db = new sqlite3.Database(dbPath);

  console.log('Adding new packages...');

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
        }
      );
    } else {
      console.log('Sample user found with ID:', user.id);
      insertPackages(user.id);
    }
  });

  function insertPackages(sampleUserId) {
    const newPackages = [
      {
        name: "PixelCraft Pro",
        description: "Advanced pixel art and sprite creation tool",
        author_id: sampleUserId,
        author_name: "CreativePro",
        category: "Design",
        image_url: "/images/aseprite.png",
        shortcuts: JSON.stringify([
          { key: "Ctrl+N", description: "New sprite" },
          { key: "Ctrl+O", description: "Open sprite" },
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
          { key: "Ctrl+Alt+Shift+F", description: "Find/Change in Layer" },
          { key: "Ctrl+Shift+K", description: "Check Spelling" },
          { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in Layer" },
          { key: "Ctrl+Shift+E", description: "Edit Original" },
          { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
          { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
        ])
      },
      {
        name: "LayoutMaster Studio",
        description: "Professional layout and publishing software",
        author_id: sampleUserId,
        author_name: "CreativePro",
        category: "Design",
        image_url: "/images/indesign.png",
        shortcuts: JSON.stringify([
          { key: "Ctrl+N", description: "New document" },
          { key: "Ctrl+O", description: "Open document" },
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
          { key: "Ctrl+Alt+Shift+[", description: "Send to Back of Page" },
          { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of Page" },
          { key: "Ctrl+Alt+[", description: "Send Backward in Page" },
          { key: "Ctrl+Alt+]", description: "Bring Forward in Page" },
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
        name: "UX Prototype Pro",
        description: "Interactive prototyping and design collaboration platform",
        author_id: sampleUserId,
        author_name: "CreativePro",
        category: "Design",
        image_url: "/images/figma.png",
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
          { key: "Ctrl+L", description: "Lock" },
          { key: "Ctrl+Alt+L", description: "Unlock All" },
          { key: "Ctrl+Shift+L", description: "Lock Others" },
          { key: "Ctrl+Alt+Shift+L", description: "Unlock All on Frame" },
          { key: "Ctrl+Shift+[", description: "Send to Back" },
          { key: "Ctrl+Shift+]", description: "Bring to Front" },
          { key: "Ctrl+[", description: "Send Backward" },
          { key: "Ctrl+]", description: "Bring Forward" },
          { key: "Ctrl+Alt+Shift+[", description: "Send to Back of Frame" },
          { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of Frame" },
          { key: "Ctrl+Alt+[", description: "Send Backward in Frame" },
          { key: "Ctrl+Alt+]", description: "Bring Forward in Frame" },
          { key: "Ctrl+Shift+O", description: "Create Outlines" },
          { key: "Ctrl+Shift+F", description: "Find/Change" },
          { key: "Ctrl+Alt+Shift+F", description: "Find/Change in Frame" },
          { key: "Ctrl+Shift+K", description: "Check Spelling" },
          { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in Frame" },
          { key: "Ctrl+Shift+E", description: "Edit Original" },
          { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
          { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
        ])
      },
      {
        name: "MotionFX Studio",
        description: "Professional motion graphics and animation software",
        author_id: sampleUserId,
        author_name: "CreativePro",
        category: "Design",
        image_url: "/images/after-effects.png",
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
          { key: "Ctrl+Alt+Shift+F", description: "Find/Change in Layer" },
          { key: "Ctrl+Shift+K", description: "Check Spelling" },
          { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in Layer" },
          { key: "Ctrl+Shift+E", description: "Edit Original" },
          { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
          { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
        ])
      },
      {
        name: "KnowledgeBase Hub",
        description: "All-in-one workspace for notes, docs, and team collaboration",
        author_id: sampleUserId,
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
        author_id: sampleUserId,
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
          { key: "Ctrl+Alt+Shift+L", description: "Unlock All on Issue" },
          { key: "Ctrl+Shift+[", description: "Send to Back" },
          { key: "Ctrl+Shift+]", description: "Bring to Front" },
          { key: "Ctrl+[", description: "Send Backward" },
          { key: "Ctrl+]", description: "Bring Forward" },
          { key: "Ctrl+Alt+Shift+[", description: "Send to Back of Issue" },
          { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of Issue" },
          { key: "Ctrl+Alt+[", description: "Send Backward in Issue" },
          { key: "Ctrl+Alt+]", description: "Bring Forward in Issue" },
          { key: "Ctrl+Shift+O", description: "Create Outlines" },
          { key: "Ctrl+Shift+F", description: "Find/Change" },
          { key: "Ctrl+Alt+Shift+F", description: "Find/Change in Issue" },
          { key: "Ctrl+Shift+K", description: "Check Spelling" },
          { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in Issue" },
          { key: "Ctrl+Shift+E", description: "Edit Original" },
          { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
          { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
        ])
      },
      {
        name: "CodeCraft Editor",
        description: "Advanced code editor with intelligent features and debugging",
        author_id: sampleUserId,
        author_name: "DevMaster",
        category: "Development",
        image_url: "/images/vscode.png",
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
          { key: "Ctrl+L", description: "Lock" },
          { key: "Ctrl+Alt+L", description: "Unlock All" },
          { key: "Ctrl+Shift+L", description: "Lock Others" },
          { key: "Ctrl+Alt+Shift+L", description: "Unlock All on File" },
          { key: "Ctrl+Shift+[", description: "Send to Back" },
          { key: "Ctrl+Shift+]", description: "Bring to Front" },
          { key: "Ctrl+[", description: "Send Backward" },
          { key: "Ctrl+]", description: "Bring Forward" },
          { key: "Ctrl+Alt+Shift+[", description: "Send to Back of File" },
          { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of File" },
          { key: "Ctrl+Alt+[", description: "Send Backward in File" },
          { key: "Ctrl+Alt+]", description: "Bring Forward in File" },
          { key: "Ctrl+Shift+O", description: "Create Outlines" },
          { key: "Ctrl+Shift+F", description: "Find/Change" },
          { key: "Ctrl+Alt+Shift+F", description: "Find/Change in File" },
          { key: "Ctrl+Shift+K", description: "Check Spelling" },
          { key: "Ctrl+Alt+Shift+K", description: "Check Spelling in File" },
          { key: "Ctrl+Shift+E", description: "Edit Original" },
          { key: "Ctrl+Alt+Shift+E", description: "Edit Original in Place" },
          { key: "Ctrl+Shift+Alt+E", description: "Edit Original in New Window" }
        ])
      },
      {
        name: "iOS Dev Studio",
        description: "Complete iOS development environment with simulator and debugging",
        author_id: sampleUserId,
        author_name: "DevMaster",
        category: "Development",
        image_url: "/images/xcode.png",
        shortcuts: JSON.stringify([
          { key: "Ctrl+N", description: "New project" },
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
          { key: "Ctrl+Alt+Shift+L", description: "Unlock All on Project" },
          { key: "Ctrl+Shift+[", description: "Send to Back" },
          { key: "Ctrl+Shift+]", description: "Bring to Front" },
          { key: "Ctrl+[", description: "Send Backward" },
          { key: "Ctrl+]", description: "Bring Forward" },
          { key: "Ctrl+Alt+Shift+[", description: "Send to Back of Project" },
          { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of Project" },
          { key: "Ctrl+Alt+[", description: "Send Backward in Project" },
          { key: "Ctrl+Alt+]", description: "Bring Forward in Project" },
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
        name: "3D Model Forge",
        description: "Professional 3D modeling and animation software",
        author_id: sampleUserId,
        author_name: "CreativePro",
        category: "Design",
        image_url: "/images/blender.png",
        shortcuts: JSON.stringify([
          { key: "Ctrl+N", description: "New scene" },
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
          { key: "Ctrl+Alt+Shift+L", description: "Unlock All on Scene" },
          { key: "Ctrl+Shift+[", description: "Send to Back" },
          { key: "Ctrl+Shift+]", description: "Bring to Front" },
          { key: "Ctrl+[", description: "Send Backward" },
          { key: "Ctrl+]", description: "Bring Forward" },
          { key: "Ctrl+Alt+Shift+[", description: "Send to Back of Scene" },
          { key: "Ctrl+Alt+Shift+]", description: "Bring to Front of Scene" },
          { key: "Ctrl+Alt+[", description: "Send Backward in Scene" },
          { key: "Ctrl+Alt+]", description: "Bring Forward in Scene" },
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

    let addedCount = 0;
    let totalPackages = newPackages.length;

    function checkCompletion() {
      if (addedCount === totalPackages) {
        console.log(`Successfully added ${addedCount} new packages!`);
        db.close();
      }
    }

    newPackages.forEach((pkg) => {
      // Check if package already exists
      db.get('SELECT id FROM shortcut_packages WHERE name = ?', [pkg.name], (err, existing) => {
        if (err) {
          console.error(`Error checking package ${pkg.name}:`, err.message);
          return;
        }

        if (existing) {
          console.log(`Package ${pkg.name} already exists, skipping...`);
          addedCount++;
          checkCompletion();
        } else {
          // Insert new package
          db.run(
            'INSERT INTO shortcut_packages (name, description, shortcuts, image_url, author_id, author_name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
            [pkg.name, pkg.description, pkg.shortcuts, pkg.image_url, pkg.author_id, pkg.author_name, pkg.category],
            function(err) {
              if (err) {
                console.error(`Error adding package ${pkg.name}:`, err.message);
                return;
              }
              console.log(`Added package: ${pkg.name}`);
              addedCount++;
              checkCompletion();
            }
          );
        }
      });
    });
  }
}

// Run the script
addNewPackages(); 