import {
  ComputedOptions,
  MethodOptions,
  ComponentOptionsWithoutProps,
  ComponentOptionsWithArrayProps,
  ComponentOptionsWithObjectProps,
  ComponentOptionsMixin,
  RenderFunction,
  ComponentInjectOptions,
  ComponentOptions,
  ComponentOptionsBase
} from './componentOptions'
import {
  SetupContext,
  AllowedComponentProps,
  ComponentCustomProps
} from './component'
import {
  ExtractPropTypes,
  ComponentPropsOptions,
  ExtractDefaultPropTypes,
  ComponentObjectPropsOptions
} from './componentProps'
import { EmitsOptions, EmitsToProps } from './componentEmits'
import { extend, isFunction } from '@vue/shared'
import { VNodeProps } from './vnode'
import {
  CreateComponentPublicInstance,
  ComponentPublicInstanceConstructor
} from './componentPublicInstance'
import { SlotsType } from './componentSlots'

export type PublicProps = VNodeProps &
  AllowedComponentProps &
  ComponentCustomProps

type ResolveProps<PropsOrPropOptions, E extends EmitsOptions> = Readonly<
  PropsOrPropOptions extends ComponentPropsOptions
    ? ExtractPropTypes<PropsOrPropOptions>
    : PropsOrPropOptions
> &
  ({} extends E ? {} : EmitsToProps<E>)

export type DefineComponent<
  PropsOrPropOptions = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = ComputedOptions,
  M extends MethodOptions = MethodOptions,
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  EE extends string = string,
  PP = PublicProps,
  Props = ResolveProps<PropsOrPropOptions, E>,
  Defaults = ExtractDefaultPropTypes<PropsOrPropOptions>,
  I extends ComponentInjectOptions = {},
  II extends string = string,
  S extends SlotsType = {},
  Options = {}
> = ComponentPublicInstanceConstructor<
  CreateComponentPublicInstance<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    PP & Props,
    Defaults,
    true,
    I,
    S
  > &
    Props
> &
  Omit<
    ComponentOptionsBase<
      Props,
      RawBindings,
      D,
      C,
      M,
      Mixin,
      Extends,
      E,
      EE,
      Defaults,
      I,
      II,
      S
    >,
    'props'
  > & { props: PropsOrPropOptions } & Omit<Options, '__asyncLoader'> &
  PP

// defineComponent is a utility that is primarily used for type inference
// when declaring components. Type inference is provided in the component
// options (provided as the argument). The returned value has artificial types
// for TSX / manual render function / IDE support.

// overload 1: direct setup function
export function defineComponent<
  Props extends Record<string, any>,
  E extends EmitsOptions = {},
  EE extends string = string,
  S extends SlotsType = {},
  Options = {}
>(
  setup: (
    props: Props,
    ctx: SetupContext<E, S>
  ) => RenderFunction | Promise<RenderFunction>,
  options?: Options &
    Pick<ComponentOptions, 'name' | 'inheritAttrs'> & {
      props?: (keyof Props)[]
      emits?: E | EE[]
      slots?: S
    }
): (props: Props & EmitsToProps<E>) => any

export function defineComponent<
  Props extends Record<string, any>,
  E extends EmitsOptions = {},
  EE extends string = string,
  S extends SlotsType = {}
>(
  setup: (
    props: Props,
    ctx: SetupContext<E, S>
  ) => RenderFunction | Promise<RenderFunction>,
  options?: Pick<ComponentOptions, 'name' | 'inheritAttrs'> & {
    props?: (keyof Props)[]
    emits?: E | EE[]
    slots?: S
  }
): (props: Props & EmitsToProps<E>) => any

// (uses user defined props interface)
export function defineComponent<
  Props extends Record<string, any>,
  E extends EmitsOptions = {},
  EE extends string = string,
  S extends SlotsType = {},
  Options = {}
>(
  setup: (
    props: Props,
    ctx: SetupContext<E, S>
  ) => RenderFunction | Promise<RenderFunction>,
  options?: Options &
    Pick<ComponentOptions, 'name' | 'inheritAttrs'> & {
      props?: (keyof Props)[]
      emits?: E | EE[]
      slots?: S
    }
): DefineComponent<
  Props & EmitsToProps<E>,
  {},
  {},
  {},
  {},
  {},
  {},
  E,
  EE,
  PublicProps,
  ResolveProps<Props, E>,
  ExtractDefaultPropTypes<Props>,
  {},
  string,
  S,
  {
    name: string
  } & Options
>

// extend({ name: options.name }, extraOptions, { setup: options }))()

export function defineComponent<
  Props extends Record<string, any>,
  E extends EmitsOptions = {},
  EE extends string = string,
  S extends SlotsType = {},
  Options = {}
>(
  setup: (
    props: Props,
    ctx: SetupContext<E, S>
  ) => RenderFunction | Promise<RenderFunction>,
  options?: Pick<ComponentOptions, 'name' | 'inheritAttrs'> & {
    props?: ComponentObjectPropsOptions<Props>
    emits?: E | EE[]
    slots?: S
  }
): DefineComponent<
  Props & EmitsToProps<E>,
  {},
  {},
  {},
  {},
  {},
  {},
  E,
  EE,
  PublicProps,
  ResolveProps<Props, E>,
  ExtractDefaultPropTypes<Props>,
  {},
  string,
  S,
  {
    name: string
  } & Options
>

// overload 2: object format with no props
// (uses user defined props interface)
// return type is for Vetur and TSX support
export function defineComponent<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string,
  S extends SlotsType = {},
  Options = {}
>(
  options: Options &
    ComponentOptionsWithoutProps<
      Props,
      RawBindings,
      D,
      C,
      M,
      Mixin,
      Extends,
      E,
      EE,
      I,
      II,
      S
    >
): DefineComponent<
  Props,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  PublicProps,
  ResolveProps<Props, E>,
  ExtractDefaultPropTypes<Props>,
  I,
  II,
  S,
  Options
>

// overload 3: object format with array props declaration
// props inferred as { [key in PropNames]?: any }
// return type is for Vetur and TSX support

export function defineComponent<
  PropNames extends string,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  EE extends string = string,
  S extends SlotsType = {},
  I extends ComponentInjectOptions = {},
  II extends string = string,
  Props = Readonly<{ [key in PropNames]?: any }>,
  Options = {}
>(
  options: Options &
    ComponentOptionsWithArrayProps<
      PropNames,
      RawBindings,
      D,
      C,
      M,
      Mixin,
      Extends,
      E,
      EE,
      I,
      II,
      S
    >
): DefineComponent<
  Props,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  PublicProps,
  ResolveProps<Props, E>,
  ExtractDefaultPropTypes<Props>,
  I,
  II,
  S,
  Options
>

// overload 4: object format with object props declaration
// see `ExtractPropTypes` in ./componentProps.ts
export function defineComponent<
  // the Readonly constraint allows TS to treat the type of { required: true }
  // as constant instead of boolean.
  PropsOptions extends Readonly<ComponentPropsOptions>,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string,
  S extends SlotsType = {}
>(
  options: ComponentOptionsWithObjectProps<
    PropsOptions,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE,
    I,
    II,
    S
  >
): DefineComponent<
  PropsOptions,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  PublicProps,
  ResolveProps<PropsOptions, E>,
  ExtractDefaultPropTypes<PropsOptions>,
  I,
  II,
  S
>

// implementation, close to no-op
/*! #__NO_SIDE_EFFECTS__ */
export function defineComponent(options: unknown, extraOptions?: unknown) {
  return isFunction(options)
    ? // #8326: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      /*#__PURE__*/ (() =>
        extend({ name: options.name }, extraOptions, { setup: options }))()
    : options
}
