# 002 Argo CD

## Prerequisites

1. Complete [001-AKS Arc Setup](../001%20AKS%20Arc%20Setup/001%20AKS%20Arc%20Setup.md)
2. Login to AZ CLI

## Explanation

So far, we have an AKS cluster with Azure Arc enabled. We will now enable FluxV2 on the cluster. For this hack, I will use the Az CLI, but this is also possible (and fairly easy) to do from the Azure Portal.

Additionally, we will be enabling Flux access for a private Git repository, instead of a public one.

## Steps

1. Run the following to install the K8s Configuration extension for AZ CLI:

    `az extension add -n k8s-configuration`

2. Since we'll be working with a private Git repository, there are a few intermediate steps to accomplish before we add the Flux configuration to the cluster. First, generate an ssh key pair using:

    `ssh-keygen -t rsa -b 4096`

3. Add the public key to your Github repository under Security > Deploy Keys.

4. Then run the following to create a Flux configuration on the Kubernetes cluster and to install the `microsoft.flux` extension:

    ```bash
    az k8s-configuration flux create -g <resourceGroup> \
    -c <ArcCluster> \
    -n cluster-config \
    --namespace cluster-config \
    -t connectedClusters \
    --scope cluster \
    -u <gitRepositoryName> \
    --branch main \
    --ssh-private-key-file </path/to/your/private/key>
    ```

    You need to rename the Resource Group, Arc cluster name and git repository in the above commmand. Ensure that the Git repository URL is a `git@github` SSH URL. You can find it in your Git repository as shown below:

    ![SSHURL](../Images/SSHUrl.png)

    As a sidenote, you would change `connectedClusters` to `managedClusters` if you were installing Flux on only an AKS, non-Arc cluster.

    There are a number of other ways to configure security for Flux: You can find a list of Flux V2 parameters [here](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/azure-arc/kubernetes/gitops-flux2-parameters.md).

5. To confirm a successful deployment, run the following:

    `az k8s-configuration flux show -g <resourceGroup> -c <ArcCluster> -n cluster-config -t connectedClusters`

    If this shows you the `flux-system` and `cluster-config` namespaces, you're good to go! It is currently monitoring the default root level of the git repository. We will change that soon!