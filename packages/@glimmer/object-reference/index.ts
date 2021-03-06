export {
  ComputedReferenceBlueprint,
  InnerReferenceFactory,
  PropertyReference,
} from './lib/references/descriptors';
export { CLASS_META, default as Meta, metaFor } from './lib/meta';
export { setProperty, notifyProperty } from './lib/object';
export * from './lib/types';
export { default as ObjectReference } from './lib/references/path';
export { default as UpdatableRootReference, State } from './lib/references/root';
export { ConstReference } from '@glimmer/reference';
export { isConst } from '@glimmer/validator';
