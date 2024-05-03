# 001 Kubernetes Setup

## Explanation

1. Set up an Azure Container registry.
2. Set up an Azure Kubernetes cluster.
3. Set up pull authorization for the ACR in the AKS Cluster.
4. Connect the AKS cluster to Azure Arc

Strictly speaking, step 4 is not necessary. However, I wanted to run through this with Arc enabled kubernetes because that's the biggest reason to opt for using Flux instead of Argo CD.

This should be all the Azure resources you need for the rest of this hack.

## Steps

Follow these steps:

1. Open the command prompt or terminal.
2. Navigate to the directory where the script is located.
3. Run `az login` and make sure you're in the right subscription.
4. Run the following commands:

    ```bash
    az group create --location eastus --name <resource-group-name>

    az acr create -n <name of registry> -g <resource group> --sku Standard
    
    az aks create --location eastus --name wth-aks02-poc --node-count 3  --no-ssh-key --resource-group wth-rg02-poc --zones 1 2 3 --enable-managed-identity
    ```

5. Wait for the deployment to complete. You can monitor the progress in the command prompt or terminal.

    Now, you have an Azure Kubernetes Service cluster, but it is not Arc enabled yet. We will do this now.

6. Run the following to install the Arc and K8s extensions for Azure CLI:

    ```bash
    az extension add --name connectedk8s
    az extension add -n k8s-extension
    ```

7. Register the following providers:

    ```bash
    az provider register --namespace Microsoft.Kubernetes
    az provider register --namespace Microsoft.KubernetesConfiguration
    az provider register --namespace Microsoft.ExtendedLocation
    ```

    If you need to monitor the registration, you can do so by running:

    `az provider show -n <providerName> -o table`

    Registration can take up to 10 minutes.

8. Connect the cluster to Azure Arc:

    `az connectedk8s connect --name <ClusterName> --resource-group <ResourceGroup>`

    This could take a few minutes, but after this the cluster should be connected to Azure Arc.

9. Verify Arc connection via:

    `az connectedk8s list --resource-group <resourceGroup --output table`

10. Now, attach the ACR to this cluster using the following:

    `az aks update -n myAKSCluster -g myResourceGroup --attach-acr <acrName>`
