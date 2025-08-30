import { createServer } from "@modelcontext/protocol";

async function main() {
  const server = createServer({
    name: "example-mcp-server",
    version: "0.1.0"
  });

  // Example route
  server.route("ping", async () => {
    return { message: "pong" };
  });

  // Start the server
  await server.listen(3000);
  console.log("🚀 Example MCP Server running at http://localhost:3000");
}

main().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
