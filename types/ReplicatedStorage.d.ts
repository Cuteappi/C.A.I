interface ReplicatedStorage extends Instance {
    Character: Part;
    rbxts_include: Folder & {
        RuntimeLib: ModuleScript;
        Promise: ModuleScript;
        node_modules: Folder & {
            ["@rbxts"]: Folder & {
                services: ModuleScript;
                ["compiler-types"]: Folder & {
                    types: Folder;
                };
                types: Folder & {
                    include: Folder & {
                        generated: Folder;
                    };
                };
            };
        };
    };
}
