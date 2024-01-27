				import worker, * as OTHER_EXPORTS from "C:\\Users\\MARTVONK LEON\\Desktop\\lf\\.wrangler\\tmp\\pages-fxcRcA\\18w4kpr26n9.js";
				import * as __MIDDLEWARE_0__ from "C:\\Users\\MARTVONK LEON\\Desktop\\lf\\node_modules\\wrangler\\templates\\middleware\\middleware-miniflare3-json-error.ts";
				const envWrappers = [__MIDDLEWARE_0__.wrap].filter(Boolean);
				const facade = {
					...worker,
					envWrappers,
					middleware: [
						__MIDDLEWARE_0__.default,
            ...(worker.middleware ? worker.middleware : []),
					].filter(Boolean)
				}
				export * from "C:\\Users\\MARTVONK LEON\\Desktop\\lf\\.wrangler\\tmp\\pages-fxcRcA\\18w4kpr26n9.js";

				const maskDurableObjectDefinition = (cls) =>
					class extends cls {
						constructor(state, env) {
							let wrappedEnv = env
							for (const wrapFn of envWrappers) {
								wrappedEnv = wrapFn(wrappedEnv)
							}
							super(state, wrappedEnv);
						}
					};
				

				export default facade;