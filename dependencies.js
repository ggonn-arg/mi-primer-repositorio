const dependencies = new Map();

export function getDependencies(name) {
    return dependencies.get(name);
}