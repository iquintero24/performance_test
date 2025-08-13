import { uploadClientsToTheDatabase } from "./load_clients.js";
import { uploadInvoicesToTheDatabase } from "./load_invoices.js";
import { uploadtransactionsToTheDatabase } from "./load_transactions.js";

(async () => {
  try {
    console.log("🚀 Iniciando seeders...");

    await uploadClientsToTheDatabase();
    await uploadInvoicesToTheDatabase();
    await uploadtransactionsToTheDatabase();

    console.log("✅ All seeders executed correctly.");
  } catch (error) {
    console.error("❌ Error executing seeders:", error.message);
  } finally {
    process.exit();
  }
})();
