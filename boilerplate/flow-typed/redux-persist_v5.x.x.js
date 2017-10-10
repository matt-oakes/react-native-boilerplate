// flow-typed signature: 28fda6532ec4d699152b118dffdd19ec
// flow-typed version: <<STUB>>/redux-persist_v5.0.0/flow_v0.56.0

type PersistState = {
  version: number,
  rehydrated: boolean,
}

type PersistPartial = { _persist: PersistState }

type PersistedState = PersistPartial | void

type PersistConfig = {
  version?: number,
  storage: Object,
  key: string,
  keyPrefix?: string,
  debug?: boolean,
  blacklist?: Array<string>,
  whitelist?: Array<string>,
  transforms?: Array<Transform>,
  throttle?: number,
  migrate?: (PersistedState, number) => Promise<PersistedState>,
  getStoredState?: PersistConfig => Promise<PersistedState>,
  autoRehydrate?: boolean,
}

type PersistorOptions = {
  enhancer?: Function,
}

type Storage = {
  getItem: (string, ?(string) => any) => any,
  setItem: (string, string, ?() => any) => any,
  removeItem: (string, ?() => any) => any,
}

type MigrationManifest = {
  [number | string]: (PersistedState) => PersistedState,
}

type Transform = {
  in: (Object, string) => Object,
  out: (Object, string) => Object,
  config?: PersistConfig,
}

type TransformConfig = {
  whitelist?: Array<string>,
  blacklist?: Array<string>,
}

type RehydrateErrorType = any

type RehydrateAction = {
  type: 'redux-persist/REHYDRATE',
  key: string,
  payload: ?Object,
  err: ?RehydrateErrorType,
}

type Persistoid = {
  update: Object => void,
  flush: () => Promise<any>,
}

type RegisterAction = {
  type: 'redux-persist/REGISTER',
  key: string,
}

type PersistorAction = RehydrateAction | RegisterAction

type PersistorState = {
  registry: Array<string>,
  bootstrapped: boolean,
}

type PersistorSubscribeCallback = () => void

type Persistor = {
  purge: () => Promise<any>,
  flush: () => Promise<any>,
  +dispatch: PersistorAction => PersistorAction,
  +getState: () => PersistorState,
  +subscribe: PersistorSubscribeCallback => () => void,
}

declare module 'redux-persist' {
  declare function createMigrate(migrations: MigrationManifest, config?: { debug: boolean }): (state: PersistedState, currentVersion: number) => Promise<PersistedState>
  declare function createPersistoid(config: PersistConfig): Persistoid
  declare function createTransform(inbound: Function, outbound: Function, config?: TransformConfig): {
    in: (state: Object, key: string) => Object,
    out: (state: Object, key: string) => Object
  }
  declare function getStoredState(config: PersistConfig
  ): Promise<Object | void>
  declare function persistReducer<State: Object, Action: Object>(config: PersistConfig, baseReducer: (State, Action) => State): (State, Action) => State & PersistPartial
  declare function persistStore(store: Object, options?: PersistorOptions, cb?: () => any): Persistor
  declare function purgeStoredState(config: PersistConfig): any
}

declare module 'redux-persist/lib/constants' {
  declare var KEY_PREFIX: string
  declare var FLUSH: string
  declare var REHYDRATE: string
  declare var PAUSE: string
  declare var PERSIST: string
  declare var PURGE: string
  declare var REGISTER: string
  declare var DEFAULT_VERSION: string
}

type V4Config = {
  storage?: Object,
  keyPrefix?: string,
  transforms?: Array<Transform>,
  blacklist?: Array<string>,
  whitelist?: Array<string>,
}

declare module 'redux-persist/lib/integration/getStoredStateMigrateV4' {
  declare module.exports: (v4Config: V4Config) => (v5Config: PersistConfig) => Object
}

type PersistGateProps = {
  onBeforeLift?: Function,
  children?: React.Node,
  loading: React.Node,
  persistor: Persistor,
}

declare module 'redux-persist/lib/integration/react' {
  declare var PersistGate: React.ComponentType<PersistGateProps>
}

declare module 'redux-persist/lib/storage' {
  declare module.exports: Storage
}
