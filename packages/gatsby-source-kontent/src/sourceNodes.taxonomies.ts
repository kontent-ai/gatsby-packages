import { SourceNodesArgs } from 'gatsby';
import { CustomPluginOptions, KontentTaxonomy } from './types';
import {
  getKontentTaxonomyTypeName,
  getKontentTaxonomyNodeStringForCodeName,
} from './naming';
import { loadAllKontentTaxonomies } from './client';

const getKontentTypeArtifact = (
  api: SourceNodesArgs,
  kontentTaxonomy: KontentTaxonomy,
  includeRawContent: boolean,
): KontentTaxonomy => {
  const nodeIdString = getKontentTaxonomyNodeStringForCodeName(
    kontentTaxonomy.system.codename,
  );
  const nodeData: KontentTaxonomy = {
    ...kontentTaxonomy,
    id: api.createNodeId(nodeIdString),
    children: [],
    internal: {
      type: getKontentTaxonomyTypeName(),
      contentDigest: api.createContentDigest(kontentTaxonomy),
    },
  };
  if (includeRawContent) {
    nodeData.internal.content = JSON.stringify(kontentTaxonomy);
  }
  return nodeData;
};

const sourceNodes = async (
  api: SourceNodesArgs,
  options: CustomPluginOptions,
): Promise<void> => {
  const kontentTaxonomies = await loadAllKontentTaxonomies(options);
  for (const kontentTaxonomy of kontentTaxonomies) {
    const nodeData = getKontentTypeArtifact(
      api,
      kontentTaxonomy,
      options.includeRawContent,
    );
    api.actions.createNode(nodeData);
  }
};

export { sourceNodes as kontentTaxonomiesSourceNodes };
