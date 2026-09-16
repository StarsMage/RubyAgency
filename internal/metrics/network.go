package metrics

import (
	"errors"

	//github
	"github.com/shirou/gopsutil/v4/net"
)

type NetworkInfo struct {
    Name       string `json:"Name"`
    BytesSent  uint64 `json:"BytesSent"`
    BytesRecv  uint64 `json:"BytesRecv"`
    PacketSent uint64 `json:"PacketSent"`
    PacketRecv uint64 `json:"PacketRecv"`
}

func NetworkCheck() ([]NetworkInfo,error) {
	netInfo,err := net.IOCounters(true)
	if err != nil {
		return []NetworkInfo{},errors.New("network.go error: NetworkCheck function error: error get information about the network.")
	}

	var networks []NetworkInfo

	for _,k := range netInfo {
		networks = append(networks, NetworkInfo{
			Name: k.Name,
			BytesSent: k.BytesSent,
			BytesRecv: k.BytesRecv,
			PacketSent: k.PacketsSent,
			PacketRecv: k.PacketsRecv,
		})
	}

	return networks,nil
}

