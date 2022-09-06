class MappingConfig {
    private mappings: {[key: string]: string} = {};

    public addMapping(key: string, value: string): MappingConfig {
        this.mappings[key] = value;
        return this;
    }

    public getValue(key: string): string {
        return this.mappings[key];
    }
}
