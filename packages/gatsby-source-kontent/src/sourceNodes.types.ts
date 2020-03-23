import { SourceNodesArgs } from "gatsby";
import { CustomPluginOptions, KontentType, KontentTypeElementArrayItem, KontentTypeElementsObject } from "./types";
import { getKontentTypeNodeStringForCodeName, getKontentTypeTypeName } from "./naming";
import { loadAllKontentTypes } from "./client";

const getKontentTypeArtifact = (api: SourceNodesArgs, kontentType: KontentType): KontentType => {
  const nodeIdString = getKontentTypeNodeStringForCodeName(kontentType.system.codename);
  const nodeContent = JSON.stringify(kontentType)
  const nodeData: KontentType = {
    ...kontentType,
    id: api.createNodeId(nodeIdString),
    children: [],
    internal: {
      type: getKontentTypeTypeName(),
      content: nodeContent,
      contentDigest: api.createContentDigest(kontentType),
    },
  };
  return nodeData;
};

const transformElementObjectToArray = (types: Array<KontentType>): void => {

  types.forEach(type =>{
    (type.elements as KontentTypeElementArrayItem[]) = Object
      .keys(type.elements)
      .map((key: string) => {
        (type.elements as KontentTypeElementsObject)[key].codename = key;
        return (type.elements as KontentTypeElementsObject)[key];
    });
  });
}


const sourceNodes = async (api: SourceNodesArgs, options: CustomPluginOptions): Promise<void> => {
  const kontentTypes = await loadAllKontentTypes(options.projectId);
  transformElementObjectToArray(kontentTypes) ;
  for (const kontentType of kontentTypes) {
    const nodeData = getKontentTypeArtifact(api, kontentType);
    api.actions.createNode(nodeData);
  }
};


export {
  sourceNodes as kontentTypesSourceNodes
};
