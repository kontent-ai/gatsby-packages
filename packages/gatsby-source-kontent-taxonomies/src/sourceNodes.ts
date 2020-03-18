import { SourceNodesArgs } from "gatsby";
import { CustomPluginOptions, KontentTaxonomy } from "./types";
import { getKontentTaxonomyTypeName, getKontentTaxonomyNodeStringForCodeName } from "./naming";
import { loadAllKontentTaxonomies } from "./client";

const getKontentTypeArtifact = (api: SourceNodesArgs, kontentTaxonomy: KontentTaxonomy): KontentTaxonomy => {
  const nodeIdString = getKontentTaxonomyNodeStringForCodeName(kontentTaxonomy.system.codename);
  const nodeContent = JSON.stringify(kontentTaxonomy)
  const nodeData: KontentTaxonomy = {
    ...kontentTaxonomy,
    id: api.createNodeId(nodeIdString),
    children: [],
    internal: {
      type: getKontentTaxonomyTypeName(),
      content: nodeContent,
      contentDigest: api.createContentDigest(kontentTaxonomy),
    },
  };
  return nodeData;
};

const sourceNodes = async (api: SourceNodesArgs, options: CustomPluginOptions): Promise<void> => {
  const kontentTaxonomies = await loadAllKontentTaxonomies(options.projectId);
  for (const kontentTaxonomy of kontentTaxonomies) {
    const nodeData = getKontentTypeArtifact(api, kontentTaxonomy);
    api.actions.createNode(nodeData);
  }
};


export {
  sourceNodes
};
