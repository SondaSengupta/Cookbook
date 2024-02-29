# How Tos and Snippets

## Azure Policies
Azure policies are checks that get run on the creation or update of Azure resources before a deployment is done. Azure first validates the request, checks authorization, and then does policy checks. The policy can either fail the deployment or pass it with auditing to know what failures would occur.

Initiatives are sets of policies. When a policy gets added to a resource, it will be run immediately, and then run with each deployment.
#### Links
- [Youtube: Intro to Azure Policies](https://www.youtube.com/watch?v=9WO4EBgUJXk)
