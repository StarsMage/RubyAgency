package metrics

import (
	"errors"
	"math"

	//github
	"github.com/shirou/gopsutil/v4/mem"
)

var gb = math.Pow(1024,3)

type RamInfo struct {
    Total       float64 `json:"Total"`
    Used        float64 `json:"Used"`
    Free        float64 `json:"Free"`
    Available   float64 `json:"Available"`
    UsedPercent float64 `json:"UsedPercent"`
}

func RamCheck() (RamInfo, error) {
	v, err := mem.VirtualMemory()

	if err != nil {
		return RamInfo{}, errors.New("ram.go error: RamCheck error: error get RAM info.")
	}

	return RamInfo{
		Total: bytesToGB(v.Total),
		Used: bytesToGB(v.Used),
		Free: bytesToGB(v.Free),
		Available: bytesToGB(v.Available),
		UsedPercent: v.UsedPercent,
	},nil
}


func bytesToGB(bytes uint64) float64 {
	return float64(bytes) / gb
}