import { spawnSync } from 'child_process'

function getNetInterfaceName() {
    const cmd = "netstat -rn | grep UG | awk '{print $NF}'"

    const interface_name = spawnSync(cmd, { shell: true})
    var raw = interface_name.stdout.toString().trim().split('\n')
    if (raw.length === 0 || raw === [''])
        return new Error('No active network interface found.')
    
    if (raw[0].toString().trim() == '')
        return new Error('No active network interface found.')

    return raw[0]
}

export function getGatewayAddressSync() {
    var domain = getNetInterfaceName()

    const cmd = "ip r | grep " + domain + " | grep default | cut -d ' ' -f 3 | head -n1"
    const gateway_ip = spawnSync(cmd, { shell : true })

    if (gateway_ip.stdout && gateway_ip.stdout.toString() != '')
        return gateway_ip.stdout.toString().trim()
    else 
        return new Error(`Error while getting Gateway IP ${gateway_ip.status}`)
}