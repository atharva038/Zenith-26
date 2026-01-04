#!/usr/bin/env python3
import re

# Read the file
with open('frontend/src/pages/AdminMarathon.jsx', 'r') as f:
    content = f.read()

# Step 1: Fix imports
content = content.replace(
    'import { useState, useEffect } from "react";\nimport { useNavigate, Link } from "react-router-dom";',
    'import { useState, useEffect, useCallback } from "react";\nimport { useNavigate } from "react-router-dom";'
)

# Add AdminLayout import after api import
content = content.replace(
    'import api from "../config/api";',
    'import api from "../config/api";\nimport AdminLayout from "../components/AdminLayout";'
)

# Step 2: Remove sidebarOpen state
content = re.sub(
    r'  const \[sidebarOpen, setSidebarOpen\] = useState\(true\);\n',
    '',
    content
)

# Step 3: Remove the token check useEffect and modify fetchRegistrations
old_pattern = r'  useEffect\(\(\) => \{\s+const token = localStorage\.getItem\("adminToken"\);\s+if \(!token\) \{\s+navigate\("/admin/login"\);\s+return;\s+\}\s+fetchRegistrations\(\);\s+\}, \[navigate, filters\]\);\s+// Fetch registrations\s+const fetchRegistrations = async \(\) => \{'
new_text = '  // Fetch registrations\n  const fetchRegistrations = useCallback(async () => {'

content = re.sub(old_pattern, new_text, content, flags=re.MULTILINE)

# Step 4: Close useCallback and add useEffect
old_end = r'      setLoading\(false\);\s+\}\s+\};'
new_end = '      setLoading(false);\n    }\n  }, [filters]);\n\n  useEffect(() => {\n    fetchRegistrations();\n  }, [fetchRegistrations]);'
content = re.sub(old_end, new_end, content, flags=re.MULTILINE)

# Step 5: Remove handleLogout function
content = re.sub(
    r'  const handleLogout = \(\) => \{\s+localStorage\.removeItem\("adminToken"\);\s+localStorage\.removeItem\("adminData"\);\s+navigate\("/admin/login"\);\s+\};\s+',
    '',
    content,
    flags=re.MULTILINE
)

# Step 6: Fix loading return statement
old_loading = r'  if \(loading\) \{\s+return \(\s+<div className="min-h-screen bg-gradient-to-br from-black via-\[#0a0a18\] to-black flex items-center justify-center">\s+<motion\.div\s+animate=\{\{ rotate: 360 \}\}\s+transition=\{\{ duration: 1, repeat: Infinity, ease: "linear" \}\}\s+className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full"\s+/>\s+</div>\s+\);\s+\}'

new_loading = '''  if (loading) {
    return (
      <AdminLayout title="Marathon">
        <div className="flex items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full"
          />
        </div>
      </AdminLayout>
    );
  }'''

content = re.sub(old_loading, new_loading, content, flags=re.MULTILINE | re.DOTALL)

# Step 7: Replace the massive return statement wrapper - find from "return (" to the stats cards
# This is complex, so we'll find the pattern and replace the beginning part

# Find the beginning of return statement up until statistics cards
pattern_start = r'  return \(\s+<div className="min-h-screen bg-gradient-to-br from-black via-\[#0a0a18\] to-black text-white">\s+\{/\* Sidebar \*/\}'

# We need to find everything from return to the start of statistics, and replace with AdminLayout wrapper
# This is getting too complex for regex. Let's try a different approach.

print("Basic replacements done. Manual cleanup needed for return statement.")
print("Writing intermediate file...")

# Write the file
with open('frontend/src/pages/AdminMarathon.jsx', 'w') as f:
    f.write(content)

print("Done! Check the file.")
