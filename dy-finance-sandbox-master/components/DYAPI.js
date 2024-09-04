import axios from 'axios'
import * as Device from 'expo-device'
import * as Network from 'expo-network'

export default class DY {
  static async choose(settings = {}, customContext) {
    const deviceAgent = `${Device.deviceName}/${Device.deviceYearClass}/${Device.osName}/${Device.osInternalBuildId}/${Device.modelName}`
    const ipAddress = await Network.getIpAddressAsync()

    const dyContext = {
      page: {
        location: '',
        referrer: '',
        data: [],
      },
      channel: 'App',
      device: {
        userAgent: deviceAgent,
        ip: ipAddress,
      },
    }

    if (customContext) {
      Object.assign(dyContext, customContext)
    }

    const options = {
      method: 'POST',
      url: `${settings.apiHost}/v2/serve/user/choose`,
      headers: {
        'DY-API-Key': settings.apiKey,
        'Content-Type': 'application/json',
      },
      data: {
        user: {
          dyid: settings.cookies?.dyid || '',
          dyid_server: settings.cookies?.dyid_server || '',
          active_consent_accepted: true,
        },
        session: {
          dy: settings.cookies?.session?.dy || '',
        },
        selector: {
          names: settings.selectors,
        },
        context: dyContext,
      },
    }

    return axios(options).then((response) => response.data)
  }

  static async reportEvent(settings = {}, events = []) {
    const deviceAgent = `${Device.deviceName}/${Device.deviceYearClass}/${Device.osName}/${Device.osInternalBuildId}/${Device.modelName}`
    const ipAddress = await Network.getIpAddressAsync()

    const options = {
      method: 'POST',
      url: `${settings.apiCollectHost}/v2/collect/user/event`,
      headers: {
        'DY-API-Key': settings.apiKey,
        'Content-Type': 'application/json',
      },
      data: {
        events: events,
      },
    }

    Object.assign(options, {
      data: {
        context: {
          channel: 'App',
          device: {
            userAgent: deviceAgent,
            ip: ipAddress,
          }
        },
        user: {
          dyid: settings.cookies.dyid,
          dyid_server: settings.cookies.dyid_server,
          active_consent_accepted: true,
        },
        session: {
          dy: settings.cookies.session.dy,
        },
        events: events,
      },
    })

    return axios(options).then((response) => response.data)
  }

  static async reportClick(settings = {}, engagement = []) {
    const deviceAgent = `${Device.deviceName}/${Device.deviceYearClass}/${Device.osName}/${Device.osInternalBuildId}/${Device.modelName}`
    const ipAddress = await Network.getIpAddressAsync()

    const options = {
      method: 'POST',
      url: `${settings.apiCollectHost}/v2/collect/user/engagement`,
      headers: {
        'DY-API-Key': settings.apiKey,
        'Content-Type': 'application/json',
      },
      data: {
        engagements: engagement,
      },
      json: true,
    }

    Object.assign(options, {
      data: {
        context: {
          channel: 'App',
          device: {
            userAgent: deviceAgent,
            ip: ipAddress,
          }
        },
        user: {
          dyid: settings.cookies.dyid,
          dyid_server: settings.cookies.dyid_server,
          active_consent_accepted: true,
        },
        session: {
          dy: settings.cookies.session.dy,
        },
        engagements: engagement,
      },
    })

    return axios(options).then((response) => response.data)
  }
}
