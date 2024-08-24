export function calcVolume(avgHeight){

    const heightTank = 213; 
    const baseRadius = 87;
    const midRadius = 110;

    const a = Math.sqrt(midRadius**2-(107-avgHeight));
    const b = baseRadius;


    // Calculate the volume of the tank in cm^3
    const tankVolume = ((1/6)*(22/7)*(heightTank-avgHeight))* ((3* (Math.pow(a, 2))) + (3* (Math.pow(b, 2))) + (heightTank-avgHeight));

    const tankVolumeLiters = Math.floor(tankVolume / 1000); // Convert to liters
    return tankVolumeLiters;
}