To fix LEDLibrary for Pi 4 Model B Rev 1.5:

Check HardwareRevision with 
`` cat /proc/cpuinfo``

go to ~/app/node_modules/rpi-ws281x-native/src/rpi_ws281x

edit file rpihw.c

Add a new Object into the list with the following Information:

```
{ 
     .hwver = 0xb03115, (Based on the Revision found in cpuinfo)
     .type = RPI_HWVER_TYPE_PI4, 
     .periph_base = PERIPH_BASE_RPI4, 
     .videocore_base = VIDEOCORE_BASE_RPI2, 
     .desc = "Pi 4 Model B - 2GB v1.5"
},
```

go to ~/app/node_modules/rpi-ws281x-native and run:
 
``node-gyp rebuild``