# Contributing to CampShure MCP Servers

Thanks for your interest in contributing! 🎉
This repository is a collection of **MCP (Model Context Protocol) servers**. Each server lives inside the `servers/` directory.

---

## 🚀 How to Add a New MCP Server

1. **Fork this repo**
   Create your own copy of the repository.

2. **Copy the example server**
   Use the provided template in [`servers/example-mcp-server`](servers/example-mcp-server) as a starting point:

   ```bash
   cp -r servers/example-mcp-server servers/my-mcp-server
   ```

3. **Rename and update**

   * Rename the folder to match your server’s name (`servers/my-mcp-server`).
   * Update `package.json` with your server’s name, description, and version.
   * Update `README.md` with instructions specific to your server.
   * Implement your server logic in `src/index.tsx`.

4. **Test your server**
   Run it locally to make sure it works:

   ```bash
   npm install
   npm run start
   ```

5. **Update the root README (if needed)**
   Add your server to the list of available MCP servers.

6. **Commit your changes**

   ```bash
   git checkout -b add-my-mcp-server
   git add .
   git commit -m "Add new MCP server: my-mcp-server"
   git push origin add-my-mcp-server
   ```

7. **Open a Pull Request (PR)**

   * Explain what your server does.
   * Include setup/run instructions.
   * Provide example usage if possible.

---

## ✅ Contribution Guidelines

* Follow the folder and naming convention (`servers/my-mcp-server`).
* Keep code clean and well-documented.
* Use meaningful commit messages.
* Ensure your server runs without errors before submitting.
* Add a license if your server is meant to be distributed separately.
* Be respectful and collaborative in discussions.

---

## 📢 Need Help?

If you have questions, feel free to open an **issue** for discussion before starting.

Happy hacking! 🚀
