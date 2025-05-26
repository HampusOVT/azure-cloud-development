# 📸 MediaVault – Azure Fullstack Node.js Project

Upload and view media files using Azure Blob Storage and Azure SQL with a Node.js backend.

---

## 🔧 Prerequisites

- Azure subscription
- Azure CLI installed
- Node.js and npm
- SQL Server Management Studio or Azure Query Editor

---

## 🏗️ Azure Setup Instructions

## 1. Resource Group & Storage

### 🏗️ 1. Create a Resource Group

```bash
az group create --name mediavault-rg --location northeurope
```

### 💡 Technical Notes:
- **Command**: `az group create`
- **Purpose**: Creates a logical container in Azure to group related resources (like storage accounts, databases, etc.).
- **--name**: Name of the resource group (`mediavault-rg`).
- **--location**: Azure region where the resources will reside (`northeurope` = (Europe) North Europe).
- Azure uses this group to manage lifecycle, access control, and billing.

---

### 📦 2. Create a Storage Account

```bash
az storage account create \
  --name mediavaultstorageproject \
  --resource-group mediavault-rg \
  --location northeurope \
  --sku Standard_LRS \
  --allow-blob-public-access
```

#### 💡 Technical Notes:
- **Command**: `az storage account create`
- **--name**: Globally unique name for the storage account (`mediavaultstorageproject`). All lowercase.
- **--resource-group**: The resource group where this account will be managed.
- **--location**: The physical region to deploy this service.
- **--sku Standard_LRS**: Specifies the redundancy tier. `Standard_LRS` = Locally Redundant Storage (3 copies within 1 datacenter).
- **--allow-blob-public-access**: Enables the option to allow containers/blobs to be public (not default).

---

### 🔑 3. Retrieve Storage Account Key

```bash
az storage account keys list \
  --account-name mediavaultstorageproject \
  --resource-group mediavault-rg \
  --query "[0].value" \
  --output tsv
```

#### 💡 Technical Notes:
- **Command**: `az storage account keys list`
- **--account-name**: Specifies which storage account to get keys from.
- **--query "[0].value"`**: Extracts the first key (accounts have 2 keys).
- **--output tsv**: Outputs result in plain text for easier scripting.
- **Why**: Needed to authenticate further operations with the storage account unless using Azure AD.

---

### 🪣 4. Create a Blob Storage Container

```bash
az storage container create \
  --name media \
  --account-name mediavaultstorageproject \
  --account-key <PASTE_YOUR_KEY_HERE> \
  --public-access blob
```

#### 💡 Technical Notes:
- **Command**: `az storage container create`
- **--name media**: The name of the container inside the storage account.
- **--account-name**: Your storage account name.
- **--account-key**: The access key retrieved above.
- **--public-access blob**: Grants anonymous read access to blobs, but not to the container listing.

📎 [Azure Storage Blob Access Levels](https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-configure?tabs=azure-portal)

---

### ✅ Result

You now have:
- A resource group
- A publicly accessible Blob Storage container named `media`
- A valid storage key to use with SDKs or scripts

Let me know if you'd like to automate this in a Bicep/ARM template or script.

Troubleshoot:
If you get
```bash
(SubscriptionNotFound) Subscription 79cf8752-d5be-42fb-b485-18d7bec4aa17 was not found.
```
then go on the subscription and register under `Resource providers` -> `Microsoft.Storage`


## 2. Azure SQL

### 🛠️ 1. Create an Azure SQL Server

```bash
az sql server create \
  --name mediavaultsql \
  --resource-group mediavault-rg \
  --location northeurope \
  --admin-user azureuser \
  --admin-password MySecureP@ssword123
```

#### 💡 Technical Explanation:
- **Command**: `az sql server create` creates a logical SQL Server in Azure.
- **--name**: The unique name of the SQL Server. It forms the DNS name: `mediavaultsql.database.windows.net`.
- **--resource-group**: Resource group for management and billing.
- **--location**: Region where the SQL Server is deployed (e.g., `northeurope`). Must be a region that currently allows provisioning.
- **--admin-user / --admin-password**: SQL authentication credentials to manage the server. Password must meet complexity requirements.

---

### 📦 2. Create a SQL Database

```bash
az sql db create \
  --resource-group mediavault-rg \
  --server mediavaultsql \
  --name mediavaultdb \
  --service-objective S0
```

#### 💡 Technical Explanation:
- **Command**: `az sql db create` provisions a database on your SQL Server.
- **--name**: Name of the database (in this case, `mediavaultdb`).
- **--service-objective S0**: Specifies the pricing and performance tier (S0 = basic DTU-based performance).

---

### 🧱 3. Initialize the Schema

Once the database is created, you can run the schema script (`init.sql`) to create tables and seed data.

#### 🔁 Option 1: Azure Portal SQL Query Editor

1. Go to [portal.azure.com](https://portal.azure.com).
2. Navigate to **SQL databases** > `mediavaultdb`.
3. Click **Query editor (preview)**.
4. Login using the SQL admin credentials you defined.
5. Copy-paste the contents of `sql/init.sql`.
6. Click **Run**.

---

#### ⚙️ Option 2: Use SQLCMD (Terminal-based)

If you have `sqlcmd` installed:

```bash
sqlcmd -S tcp:mediavaultsql.database.windows.net -U azureuser -P MySecureP@ssword123 -d mediavaultdb -i ../sql/init.sql
```

> Notes:
> - `-S`: SQL Server hostname
> - `-U/-P`: SQL auth credentials
> - `-d`: Target database name
> - `-i`: Input file path to SQL script

---

#### 📦 Option 3: Use Azure Data Studio or SSMS

1. Connect to `mediavaultsql.database.windows.net` using Azure SQL auth.
2. Open `init.sql` in a new query window.
3. Execute the script.

---

### 🛑 Security Tip

After setup, you should:
- Restrict SQL server firewall to your IP or App Service
- Avoid hardcoding passwords in scripts
- Consider managed identities for secure access

---

### ✅ Result

You now have:
- A SQL Server and Database in Azure
- A `Media` table initialized via `init.sql`


## 🚀 Run Locally

```bash
cd backend
npm install
node index.js
```

Open browser to: `http://localhost:3000`

---

## 📤 Deploy to Azure App Service

```bash
az appservice plan create --name mediavault-plan --resource-group mediavault-rg --sku B1 --is-linux
az webapp create --resource-group mediavault-rg --plan mediavault-plan --name mediavaultapp123 --runtime "NODE|18-lts"
az webapp deployment source config-local-git --name mediavaultapp123 --resource-group mediavault-rg
```

---

## 📂 Environment Variables (.env)

```
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_SQL_SERVER=mediavaultsql.database.windows.net
AZURE_SQL_DATABASE=mediavaultdb
AZURE_SQL_USER=azureuser
AZURE_SQL_PASSWORD=MySecureP@ssword123
```

---

## ✅ Done!

Visit your app at:
```
https://mediavaultapp123.azurewebsites.net
```
