package metrics

import (
	"errors"

	//github
	"github.com/shirou/gopsutil/v4/disk"
)


type DiskInfo struct {
    Path        string  `json:"Path"`
    Type        string  `json:"Type"`
    Total       float64 `json:"Total"`
    Used        float64 `json:"Used"`
    Free        float64 `json:"Free"`
    UsedPercent float64 `json:"UsedPercent"`
}

func DiskCheck() ([]DiskInfo, error) {
	partions, err := disk.Partitions(false)
	if err != nil {
		return []DiskInfo{},errors.New("disk.go error: DiskInfo function error: failed to get partions disk.")
	}

	var disks []DiskInfo 

	for _,v := range partions {
		usageTotal, err := disk.Usage(v.Mountpoint)
		if err != nil {
			continue
		}

		disks = append(disks, DiskInfo{
			Path: v.Mountpoint,
			Type: v.Fstype,
			Total: bytesToGB(usageTotal.Total),
			Used: bytesToGB(usageTotal.Used),
			Free: bytesToGB(usageTotal.Free),
			UsedPercent: usageTotal.UsedPercent,
		})
	}

	return disks,nil
}
