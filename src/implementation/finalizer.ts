interface DisposableResource {
  delete?: () => void
}

interface RegistryEntry<T> {
  resource: T
}

class ResourceRegistry {
  private registry: FinalizationRegistry<RegistryEntry<any>> | undefined =
    undefined

  constructor() {
    if (typeof FinalizationRegistry !== 'undefined') {
      this.registry = new FinalizationRegistry<RegistryEntry<any>>(entry => {
        try {
          if (entry.resource?.delete) {
            entry.resource.delete()
          }
        } catch (error) {
          // Safe to ignore: delete() may have already been called manually
          // before the finalizer is run. This makes disposal idempotent.
        }
      })
    }
  }

  register<T extends DisposableResource>(target: object, resource: T) {
    if (!this.registry) {
      return { unregister: () => {}, reregister: () => {} }
    }

    const token = target
    const entry: RegistryEntry<T> = { resource }

    this.registry.register(target, entry, token)

    return {
      unregister: () => {
        this.registry?.unregister(token)
      },

      reregister: (newResource: T) => {
        this.registry?.unregister(token)
        const newEntry: RegistryEntry<T> = {
          resource: newResource
        }
        this.registry?.register(target, newEntry, token)
      }
    }
  }
}

const globalRegistry = new ResourceRegistry()

export function autoFinalize<T extends DisposableResource>(
  target: object,
  resource: T
) {
  return globalRegistry.register(target, resource)
}
