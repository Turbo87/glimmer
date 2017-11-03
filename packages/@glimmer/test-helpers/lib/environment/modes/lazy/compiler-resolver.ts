import { ICompilableTemplate, CompileTimeLookup } from '@glimmer/opcode-compiler';
import { ProgramSymbolTable, Option, ComponentCapabilities } from '@glimmer/interfaces';
import { assert } from '@glimmer/util';
import { ComponentDefinition, WithStaticLayout } from '@glimmer/runtime';

import RuntimeResolver from './runtime-resolver';
import { TemplateLocator } from '@glimmer/bundle-compiler';

export default class LazyCompilerResolver implements CompileTimeLookup<TemplateLocator> {
  constructor(private resolver: RuntimeResolver) {
  }

  private getComponentDefinition(handle: number): ComponentDefinition {
    let definition = this.resolver.resolve<Option<ComponentDefinition>>(handle);

    assert(!!definition, `Couldn't find a template for handle ${definition}`);

    return definition!;
  }

  getCapabilities(handle: number): ComponentCapabilities {
    let definition = this.resolver.resolve<Option<ComponentDefinition>>(handle);
    let { manager, state } = definition!;
    return manager.getCapabilities(state);
  }

  getLayout(handle: number): Option<ICompilableTemplate<ProgramSymbolTable>> {
    let { manager, state } = this.getComponentDefinition(handle);
    let capabilities = manager.getCapabilities(state);

    if (capabilities.dynamicLayout === true) {
      return null;
    }

    let invocation = (manager as WithStaticLayout<any, any, TemplateLocator, RuntimeResolver>).getLayout(state, this.resolver);

    return {
      compile() { return invocation.handle; },
      symbolTable: invocation.symbolTable
    };
  }

  lookupHelper(name: string, referrer: TemplateLocator): Option<number> {
    return this.resolver.lookupHelper(name, referrer);
  }

  lookupModifier(name: string, referrer: TemplateLocator): Option<number> {
    return this.resolver.lookupModifier(name, referrer);
  }

  lookupComponentDefinition(name: string, referrer: TemplateLocator): Option<number> {
    return this.resolver.lookupComponentHandle(name, referrer);
  }

  lookupPartial(name: string, referrer: TemplateLocator): Option<number> {
    return this.resolver.lookupPartial(name, referrer);
  }
}
