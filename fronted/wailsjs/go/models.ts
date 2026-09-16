export namespace metrics {
	
	export class CpuInfo {
	    Name: string;
	    Vendor: string;
	    Architecture: string;
	    CoreInfo: Record<number, number>;
	    UsagePercent: number;
	
	    static createFrom(source: any = {}) {
	        return new CpuInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Vendor = source["Vendor"];
	        this.Architecture = source["Architecture"];
	        this.CoreInfo = source["CoreInfo"];
	        this.UsagePercent = source["UsagePercent"];
	    }
	}
	export class DiskInfo {
	    Path: string;
	    Type: string;
	    Total: number;
	    Used: number;
	    Free: number;
	    UsedPercent: number;
	
	    static createFrom(source: any = {}) {
	        return new DiskInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Path = source["Path"];
	        this.Type = source["Type"];
	        this.Total = source["Total"];
	        this.Used = source["Used"];
	        this.Free = source["Free"];
	        this.UsedPercent = source["UsedPercent"];
	    }
	}
	export class NetworkInfo {
	    Name: string;
	    BytesSent: number;
	    BytesRecv: number;
	    PacketSent: number;
	    PacketRecv: number;
	
	    static createFrom(source: any = {}) {
	        return new NetworkInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.BytesSent = source["BytesSent"];
	        this.BytesRecv = source["BytesRecv"];
	        this.PacketSent = source["PacketSent"];
	        this.PacketRecv = source["PacketRecv"];
	    }
	}
	export class RamInfo {
	    Total: number;
	    Used: number;
	    Free: number;
	    Available: number;
	    UsedPercent: number;
	
	    static createFrom(source: any = {}) {
	        return new RamInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Total = source["Total"];
	        this.Used = source["Used"];
	        this.Free = source["Free"];
	        this.Available = source["Available"];
	        this.UsedPercent = source["UsedPercent"];
	    }
	}

}

