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
  ComponentObjectPropsOptions,
  Prop,
  PropType
} from './componentProps'
import { EmitsOptions, EmitsToProps } from './componentEmits'
import { Prettify, extend, isFunction } from '@vue/shared'
import { VNodeProps } from './vnode'
import {
  CreateComponentPublicInstance,
  ComponentPublicInstanceConstructor
} from './componentPublicInstance'
import { SlotsType } from './componentSlots'
import { h } from '.'

export type PublicProps = VNodeProps &
  AllowedComponentProps &
  ComponentCustomProps

// type ResolveProps<PropsOrPropOptions, E extends EmitsOptions> = Readonly<
//   PropsOrPropOptions extends ComponentObjectPropsOptions
//     ? ExtractPropTypes<PropsOrPropOptions>
//     : [PropsOrPropOptions] extends [string]
//     ? Prettify<
//         Readonly<{ [key in PropsOrPropOptions]?: any } & EmitsToProps<E>>
//       > & { aaaa: 1 }
//     : never
// > &
//   ({} extends E ? {} : EmitsToProps<E>)

type ResolveProps<Props, E extends EmitsOptions> = [Props] extends [string]
  ? Readonly<{ [key in Props]?: any } & EmitsToProps<E>>
  : [Props] extends [ComponentObjectPropsOptions]
  ? Readonly<ExtractPropTypes<Props>> & EmitsToProps<E>
  : {}

export declare const RawOptionsSymbol: '__rawOptions'

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
  >
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
  > & { props: PropsOrPropOptions } & Omit<Options, 'props'> & {
    [RawOptionsSymbol]: Options
  } & PP
export type ComponentDefineOptions<
  Props = never,
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
  // test stuff
  // PropNames extends string = Props extends string ? Props : never,
  // PropOptions extends ComponentObjectPropsOptions<
  //   Record<keyof Props, any>
  // > = ComponentObjectPropsOptions<Record<keyof Props, any>>
> =
  | (Options & {
      props?: [Props] extends [string] ? Array<Props> : Props
    } & ([Props] extends [string]
        ? ComponentOptionsWithArrayProps<
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
        : [Props] extends [undefined]
        ? {
            props?: undefined
          } & ComponentOptionsWithoutProps<
            {},
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
        : {
            props: ComponentObjectPropsOptions
          } & (Props extends ComponentObjectPropsOptions
            ? ComponentOptionsWithObjectProps<
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
            : never)))
  | (((
      props: Props,
      ctx: SetupContext<E, S>
    ) => RenderFunction | Promise<RenderFunction>) &
      Options)
// export type ComponentDefineOptions<
//   Props = undefined,
//   RawBindings = {},
//   D = {},
//   C extends ComputedOptions = {},
//   M extends MethodOptions = {},
//   Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
//   Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
//   E extends EmitsOptions = {},
//   EE extends string = string,
//   I extends ComponentInjectOptions = {},
//   II extends string = string,
//   S extends SlotsType = {},
//   Options = {}
// > =
//   | (Options &
//       (undefined extends Props
//         ? ComponentOptionsWithoutProps<
//             {},
//             RawBindings,
//             D,
//             C,
//             M,
//             Mixin,
//             Extends,
//             E,
//             EE,
//             I,
//             II,
//             S
//           >
//         : [Props] extends [string]
//         ? ComponentOptionsWithArrayProps<
//             Props,
//             RawBindings,
//             D,
//             C,
//             M,
//             Mixin,
//             Extends,
//             E,
//             EE,
//             I,
//             II,
//             S
//           >
//         : [Props] extends [Readonly<ComponentPropsOptions>]
//         ? ComponentOptionsWithObjectProps<
//             Props,
//             RawBindings,
//             D,
//             C,
//             M,
//             Mixin,
//             Extends,
//             E,
//             EE,
//             I,
//             II,
//             S
//           >
//         : false))
//   | (((
//       props: Props,
//       ctx: SetupContext<E, S>
//     ) => RenderFunction | Promise<RenderFunction>) &
//       Options)

// defineComponent is a utility that is primarily used for type inference
// when declaring components. Type inference is provided in the component
// options (provided as the argument). The returned value has artificial types
// for TSX / manual render function / IDE support.

// overload 1: direct setup function
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
    props?: ComponentObjectPropsOptions<Props>
    emits?: E | EE[]
    slots?: S
  }
): (props: Props & EmitsToProps<E>) => any

// // overload 2: object format with no props
// // (uses user defined props interface)
// // return type is for Vetur and TSX support
// export function defineComponent<
//   Props = {},
//   RawBindings = {},
//   D = {},
//   C extends ComputedOptions = {},
//   M extends MethodOptions = {},
//   Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
//   Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
//   E extends EmitsOptions = {},
//   EE extends string = string,
//   I extends ComponentInjectOptions = {},
//   II extends string = string,
//   S extends SlotsType = {},
//   Options = {}
// >(
//   options: Options &
//     ComponentOptionsWithoutProps<
//       Props,
//       RawBindings,
//       D,
//       C,
//       M,
//       Mixin,
//       Extends,
//       E,
//       EE,
//       I,
//       II,
//       S
//     >
// ): DefineComponent<
//   Props,
//   RawBindings,
//   D,
//   C,
//   M,
//   Mixin,
//   Extends,
//   E,
//   EE,
//   PublicProps,
//   ResolveProps<Props, E>,
//   ExtractDefaultPropTypes<Props>,
//   I,
//   II,
//   S,
//   Options
// >

// // overload 3: object format with array props declaration
// // props inferred as { [key in PropNames]?: any }
// // return type is for Vetur and TSX support

// export function defineComponent<
//   PropNames extends string,
//   RawBindings,
//   D,
//   C extends ComputedOptions = {},
//   M extends MethodOptions = {},
//   Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
//   Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
//   E extends EmitsOptions = {},
//   EE extends string = string,
//   S extends SlotsType = {},
//   I extends ComponentInjectOptions = {},
//   II extends string = string,
//   Props = Readonly<{ [key in PropNames]?: any }>,
//   Options = {}
// >(
//   options: Options &
//     ComponentOptionsWithArrayProps<
//       PropNames,
//       RawBindings,
//       D,
//       C,
//       M,
//       Mixin,
//       Extends,
//       E,
//       EE,
//       I,
//       II,
//       S
//     >
// ): DefineComponent<
//   Props,
//   RawBindings,
//   D,
//   C,
//   M,
//   Mixin,
//   Extends,
//   E,
//   EE,
//   PublicProps,
//   ResolveProps<Props, E>,
//   ExtractDefaultPropTypes<Props>,
//   I,
//   II,
//   S,
//   Options
// >

// // overload 4: object format with object props declaration
// // see `ExtractPropTypes` in ./componentProps.ts
// export function defineComponent<
//   // the Readonly constraint allows TS to treat the type of { required: true }
//   // as constant instead of boolean.
//   PropsOptions extends Readonly<ComponentPropsOptions>,
//   RawBindings,
//   D,
//   C extends ComputedOptions = {},
//   M extends MethodOptions = {},
//   Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
//   Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
//   E extends EmitsOptions = {},
//   EE extends string = string,
//   I extends ComponentInjectOptions = {},
//   II extends string = string,
//   S extends SlotsType = {},
//   Options = {},
//   Props = {} extends PropsOptions ? {} : PropsOptions
// >(
//   options: Options &
//     ComponentOptionsWithObjectProps<
//       PropsOptions,
//       RawBindings,
//       D,
//       C,
//       M,
//       Mixin,
//       Extends,
//       E,
//       EE,
//       I,
//       II,
//       S
//     >
// ): DefineComponent<
//   PropsOptions,
//   RawBindings,
//   D,
//   C,
//   M,
//   Mixin,
//   Extends,
//   E,
//   EE,
//   PublicProps,
//   ResolveProps<PropsOptions, E>,
//   ExtractDefaultPropTypes<PropsOptions>,
//   I,
//   II,
//   S,
//   Options
// >

export function defineComponent<
  Props = undefined,
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
  options: ComponentDefineOptions<
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
    S,
    Options
  >
): DefineComponent<
  [Props] extends [string] ? Props[] : undefined extends Props ? {} : Props,
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
// const a = defineComponent({
//   setup() {
//     return () => h('div')
//   }
// })
const b = defineComponent({
  props: ['a', 'b'],
  setup(props) {
    props.a
  }
})
const { $props } = new b()
$props.a
$props.b
// @ts-expect-error
$props.c

// const o = defineComponent({
//   props: {
//     a: String,
//     b: null,
//     c: {
//       type: String,
//       required: true
//     }
//   },
//   setup(props) {},
//   ssss(props, _opo) {
//     props.a, props.b, props.c
//     _opo.a, _opo.b, _opo.c
//   }
// })

const a = defineComponent({
  short: true,
  props: {
    a: Number
    // bb: {
    //   testXXX: 1,
    //   validator(b: any) {
    //     return true
    //   }
    // validator(b: unknown) {
    //   return true
    // }
    // type: String
    // validator(b: unknown) {
    //   return true
    // }
    // validator: (b: unknown) => {
    //   return true
    // }
    // validator(b: string) {
    //   this.
    //   return true
    // }
    // // required should make property non-void
    // b: {
    //   type: String,
    //   required: true as true
    // },
    // e: Function,
    // h: Boolean,
    // j: Function as PropType<undefined | (() => string | undefined)>,
    // // default value should infer type and make it non-void
    // bb: {
    //   default: 'hello'
    // },
    // bbb: {
    //   // Note: default function value requires arrow syntax + explicit
    //   // annotation
    //   default: (props: any) => (props.bb as string) || 'foo'
    // },
    // bbbb: {
    //   type: String,
    //   default: undefined
    // },
    // bbbbb: {
    //   type: String,
    //   default: () => undefined
    // },
    // // explicit type casting
    // cc: Array as PropType<string[]>,
    // // required + type casting
    // dd: {
    //   type: Object as PropType<{ n: 1 }>,
    //   required: true as true
    // },
    // // return type
    // ee: Function as PropType<() => string>,
    // // arguments + object return
    // ff: Function as PropType<(a: number, b: string) => { a: boolean }>,
    // // explicit type casting with constructor
    // ccc: Array as () => string[],
    // // required + constructor type casting
    // ddd: {
    //   type: Array as () => string[],
    //   required: true as true
    // },
    // // required + object return
    // eee: {
    //   type: Function as PropType<() => { a: string }>,
    //   required: true as true
    // },
    // // required + arguments + object return
    // fff: {
    //   type: Function as PropType<(a: number, b: string) => { a: boolean }>,
    //   required: true as true
    // },
    // hhh: {
    //   type: Boolean,
    //   required: true as true
    // },
    // // default + type casting
    // ggg: {
    //   type: String as PropType<'foo' | 'bar'>,
    //   default: 'foo'
    // },
    // // default + function
    // ffff: {
    //   type: Function as PropType<(a: number, b: string) => { a: boolean }>,
    //   default: (a: number, b: string) => ({ a: a > +b })
    // },
    // // union + function with different return types
    // iii: Function as PropType<(() => string) | (() => number)>,
    // // union + function with different args & same return type
    // jjj: {
    //   type: Function as PropType<
    //     ((arg1: string) => string) | ((arg1: string, arg2: string) => string)
    //   >,
    //   required: true as true
    // },
    // kkk: null,
    // validated: {
    //   type: String,
    //   // validator requires explicit annotation
    //   validator: (val: unknown) => val !== ''
    // },
    // date: Date,
    // l: [Date],
    // ll: [Date, Number],
    // lll: [String, Number]
  },
  setup(props, ctx) {
    props.a
  }
})
