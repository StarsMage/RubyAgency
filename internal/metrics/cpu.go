package metrics

import (
	"errors"
	"runtime"
	"time"

	//github
	"github.com/klauspost/cpuid/v2"
	"github.com/shirou/gopsutil/v4/cpu"
)

type CpuInfo struct {
    Name         string          `json:"Name"`
    Vendor       string          `json:"Vendor"`
    Architecture string          `json:"Architecture"`
    CoreInfo     map[int]float64 `json:"CoreInfo"`
    UsagePercent float64         `json:"UsagePercent"`
}

func CpuCheck() (CpuInfo, error){
	var totalLoad float64
	coreLoad,err := cpu.Percent(1*time.Second,true)

	if err != nil {
		return CpuInfo{},errors.New("cpu.go error: CpuCheck error: error get the list info core procent load.")
	}

	coreCount := make(map[int]float64,)

	for i,v := range coreLoad {
		coreCount[i+1] = v
		totalLoad += v
	}

	procentLoad := totalLoad/float64(len(coreLoad))

	return CpuInfo{
		Name: cpuid.CPU.BrandName,
		Vendor: cpuid.CPU.VendorString,
		Architecture: runtime.GOARCH,
		CoreInfo: coreCount,
		UsagePercent: procentLoad,
	},nil
}
