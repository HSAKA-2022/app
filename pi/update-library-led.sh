sed -i 's:static const rpi_hw_t rpi_hw_info\[\] = {: \
static const rpi_hw_t rpi_hw_info\[\] = { \
    {\
	.hwver = 0xb03115, \
	.type = RPI_HWVER_TYPE_PI4, \
     	.periph_base = PERIPH_BASE_RPI4,\
     	.videocore_base = VIDEOCORE_BASE_RPI2,\
    	.desc = "Pi 4 Model B - 2GB v1.5"\
   },:' /home/pi/app/pi/node_modules/rpi-ws281x-native/src/rpi_ws281x/rpihw.c

cd /home/pi/app/pi/node_modules/rpi-ws281x-native || exit 1
node-gyp rebuild
